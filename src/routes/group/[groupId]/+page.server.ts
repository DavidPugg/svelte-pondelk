import { error, fail, isHttpError, type NumericRange } from '@sveltejs/kit';
import { asc, eq, sql } from 'drizzle-orm';
import { DB } from '../../../db/db.js';
import { groups, memberships } from '../../../db/schema.js';

export async function load({ params }) {
	try {
		const res = await DB.query.groups.findFirst({
			where: (groups, { eq }) => eq(groups.id, +params.groupId),
			with: { events: true }
		});

		if (!res) {
			return error(404, 'Not Found');
		}

		return { group: res };
	} catch (e) {
		if (isHttpError(e)) {
			return error(e.status as NumericRange<400, 599>, e.body.message);
		}
	}
}

export const actions = {
	leave: async ({ params, locals }) => {
		if (!locals.isAuthenticated) {
			return fail(401, { message: 'Not authorized' });
		}

		try {
			return await DB.transaction(async (trx) => {
				await trx
					.delete(memberships)
					.where(
						sql`${memberships.groupId} = ${+params.groupId} AND ${memberships.userId} = ${locals.authData.id}`
					);

				const group = await trx.query.groups.findFirst({
					where: sql`${groups.id} = ${+params.groupId}`
				});

				if (group?.authorId !== locals.authData.id) {
					return { message: 'Successfully left group' };
				}

				const row = await trx.query.memberships.findFirst({
					where: sql`${memberships.groupId} = ${+params.groupId} AND ${memberships.pending} = false`,
					orderBy: asc(memberships.createdAt)
				});

				if (!row) {
					await trx.delete(groups).where(sql`${groups.id} = ${+params.groupId}`);
					return { message: 'Successfully left and deleted group' };
				}

				await trx
					.update(groups)
					.set({ authorId: row.userId })
					.where(eq(groups.id, +params.groupId));

				return { message: 'Successfully left group' };
			});
		} catch (e) {
			console.error(e);
			return fail(404, { message: 'Error leaving group' });
		}
	},

	delete: async ({ params, locals }) => {
		if (!locals.isAuthenticated) {
			return fail(401, { message: 'Not authorized' });
		}

		try {
			await DB.delete(groups).where(
				sql`${groups.id} = ${+params.groupId} AND ${groups.authorId} = ${locals.authData.id}`
			);

			return { message: 'Successfully deleted group' };
		} catch (e) {
			console.error(e);
			return fail(404, { message: 'Error deleting group' });
		}
	}
};

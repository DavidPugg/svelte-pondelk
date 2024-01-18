import { error, fail } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { DB } from '../db/db';
import { groups, memberships } from '../db/schema';

export async function load({ locals }) {
	try {
		const res = await DB.select({
			id: groups.id,
			name: groups.name,
			description: groups.description,
			createdAt: groups.createdAt,
			authorId: groups.authorId,
			pending:
				sql<boolean>`(SELECT pending FROM memberships WHERE memberships.group_id = groups.id AND memberships.user_id = ${locals.authData?.id || 0})`.mapWith(
					Boolean
				),
			members: sql<number>`COUNT(memberships.id)`
		})
			.from(groups)
			.leftJoin(
				memberships,
				sql`${memberships.groupId} = ${groups.id} AND ${memberships.pending} = FALSE`
			)
			.groupBy(groups.id);

		return { groups: res };
	} catch (e) {
		console.error(e);
		return error(500, 'Internal Server Error');
	}
}

export const actions = {
	request: async ({ request, locals }) => {
		try {
			const data = await request.formData();
			const groupId = data.get('group-id');

			if (!groupId) {
				return fail(400, { message: 'Invalid group' });
			}

			const row = await DB.query.groups.findFirst({
				where: (groups, { eq }) => eq(groups.id, +groupId)
			});

			if (!row) {
				return fail(404, { message: 'Invalid group' });
			}

			const authUserId = locals.authData?.id;

			if (!authUserId) {
				return fail(401, { message: 'Unauthorized' });
			}

			await DB.insert(memberships).values({
				userId: authUserId,
				groupId: +groupId,
				pending: true,
				invitedBy: authUserId
			});

			return { message: 'Request sent' };
		} catch (e) {
			if (e instanceof Error) {
				return fail(400, {
					message: e.message.includes('UNIQUE')
						? 'Membership already exists'
						: 'Error creating membership request'
				});
			}

			return fail(500, { message: 'Internal Server Error' });
		}
	}
};

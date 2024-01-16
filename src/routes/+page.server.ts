import { error, fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { DB } from '../db/db';
import { groups, memberships } from '../db/schema';

export async function load() {
	try {
		const res = await DB.select({
			id: groups.id,
			name: groups.name,
			description: groups.description,
			createdAt: groups.createdAt,
			authorId: groups.authorId,
			joined: sql<boolean>`(SELECT COUNT(*) FROM memberships WHERE memberships.group_id = groups.id AND memberships.user_id = 1)`, //TODO: add auth user id
			members: sql<number>`COUNT(memberships.id)`
		})
			.from(groups)
			.leftJoin(memberships, eq(groups.id, memberships.groupId))
			.groupBy(groups.id);

		return { groups: res };
	} catch (e) {
		console.error(e);
		return error(500, 'Internal Server Error');
	}
}

export const actions = {
	request: async ({ request }) => {
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

			await DB.insert(memberships).values({
				userId: 1, //TODO: add auth user id
				groupId: +groupId,
				pending: true,
				invitedBy: 1 //TODO: add auth user id
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

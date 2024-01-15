import { error } from '@sveltejs/kit';
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
			joined: sql`(SELECT COUNT(*) FROM memberships WHERE memberships.group_id = groups.id AND memberships.user_id = 1)`, //TODO: add auth user id
			members: sql`COUNT(memberships.id)`
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

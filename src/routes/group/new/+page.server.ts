import { fail } from '@sveltejs/kit';
import { DB } from '../../../db/db';
import { groups, memberships } from '../../../db/schema';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const description = data.get('description')?.toString();

		const errors: { [key: string]: string } = {};

		if (!name) {
			errors['name'] = 'Name is required';
		}

		if (!description) {
			errors['description'] = 'Description is required';
		}

		if (Object.keys(errors).length > 0) {
			return { errors };
		}

		try {
			const [{ insertedId }] = await DB.insert(groups)
				.values({
					name: name as string,
					description: description as string,
					authorId: 1, //TODO: add auth user id
					createdAt: new Date()
				})
				.returning({ insertedId: groups.id });

			await DB.insert(memberships).values({
				userId: 1, //TODO: add auth user id
				groupId: insertedId,
				pending: false,
				createdAt: new Date()
			});

			return { insertedId };
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('UNIQUE constraint failed: groups.name')) {
					errors['name'] = 'Group name already exists';
				}
			}

			return fail(400, { errors });
		}
	}
};

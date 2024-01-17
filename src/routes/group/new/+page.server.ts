import { fail } from '@sveltejs/kit';
import { DB } from '../../../db/db';
import { groups, memberships } from '../../../db/schema';

export const actions = {
	create: async ({ request, locals }) => {
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

		const authUserId = locals.authData?.id;

		if (!authUserId) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			const [{ insertedId }] = await DB.insert(groups)
				.values({
					name: name as string,
					description: description as string,
					authorId: authUserId
				})
				.returning({ insertedId: groups.id });

			await DB.insert(memberships).values({
				userId: authUserId,
				groupId: insertedId,
				pending: false,
				invitedBy: authUserId
			});

			return { insertedId };
		} catch (e) {
			console.log(e);

			if (e instanceof Error) {
				if (e.message.includes('UNIQUE constraint failed: groups.name')) {
					errors['name'] = 'Group name already exists';
				}
			}

			return fail(400, { errors });
		}
	}
};

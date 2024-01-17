import { throwPageError } from '$lib/server/error';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { DB } from '../../../../db/db';
import { groups } from '../../../../db/schema';

export async function load({ params, locals }) {
	try {
		const row = await DB.query.groups.findFirst({
			where: (groups, { eq }) => eq(groups.id, +params.groupId)
		});

		if (locals.authData?.id !== row?.authorId) {
			return error(401, 'Unauthorized');
		}

		if (!row) {
			return error(404, 'Not Found');
		}

		return { group: row };
	} catch (e) {
		return throwPageError(e);
	}
}

export const actions = {
	edit: async ({ request, locals, params }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const description = data.get('description')?.toString();

		const errors: { [key: string]: string } = {};

		//TODO: add proper validation
		if (!name) {
			errors['name'] = 'Name is required';
		}

		if (!description) {
			errors['description'] = 'Description is required';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, message: 'Validation error' });
		}

		try {
			return await DB.transaction(async (trx) => {
				const [{ userId }] = await trx
					.update(groups)
					.set({
						name: name as string,
						description: description as string
					})
					.where(eq(groups.id, +params.groupId))
					.returning({
						userId: groups.authorId
					});

				if (locals.authData?.id !== userId) {
					trx.rollback();
					return fail(401, { message: 'Unauthorized', errors });
				}

				return { message: 'Successfully edited group' };
			});
		} catch (e) {
			console.log(e);
			if (e instanceof Error) {
				if (e.message.includes('UNIQUE')) {
					errors['name'] = 'Group name already exists';
				}
			}

			return fail(400, { errors, message: 'Failed to edit group' });
		}
	}
};

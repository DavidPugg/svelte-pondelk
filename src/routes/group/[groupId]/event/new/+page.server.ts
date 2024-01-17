import { fail } from '@sveltejs/kit';
import { DB } from '../../../../../db/db';
import { events, participations } from '../../../../../db/schema';

export const actions = {
	create: async ({ request, params, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const location = data.get('location')?.toString();

		const errors: { [key: string]: string } = {};

		if (!name) {
			errors['name'] = 'Name is required';
		}

		if (!location) {
			errors['location'] = 'location is required';
		}

		if (Object.keys(errors).length > 0) {
			return { errors };
		}

		const authUserId = locals.authData?.id;

		if (!authUserId) {
			return fail(401, { message: 'Unauthorized' });
		}

		try {
			const [{ insertedId }] = await DB.insert(events)
				.values({
					name: name as string,
					location: location as string,
					authorId: authUserId,
					groupId: +params.groupId
				})
				.returning({ insertedId: events.id });

			await DB.insert(participations).values({
				userId: authUserId,
				eventId: insertedId,
				verified: true
			});

			return { insertedId };
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('UNIQUE')) {
					errors['name'] = 'Event name already exists';
				}
			}

			return fail(400, { errors });
		}
	}
};

import { fail } from '@sveltejs/kit';
import { DB } from '../../../../../db/db';
import { events, participations } from '../../../../../db/schema';

export const actions = {
	create: async ({ request, params }) => {
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

		try {
			const [{ insertedId }] = await DB.insert(events)
				.values({
					name: name as string,
					location: location as string,
					authorId: 1, //TODO: add auth user id,
					groupId: +params.groupId,
					createdAt: new Date()
				})
				.returning({ insertedId: events.id });

			await DB.insert(participations).values({
				userId: 1, //TODO: add auth user id
				eventId: insertedId,
				verified: true,
				createdAt: new Date()
			});

			return { insertedId };
		} catch (e) {
			return fail(400, { errors });
		}
	}
};

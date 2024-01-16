import { error, fail, isHttpError, type NumericRange } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { DB } from '../../../../../db/db.js';
import { participations } from '../../../../../db/schema.js';

export async function load({ params }) {
	try {
		const res = await DB.query.events.findFirst({
			where: (events, { eq }) => eq(events.id, +params.eventId),
			with: {
				participations: {
					with: { user: true }
				}
			}
		});

		if (!res) {
			return error(404, 'Not Found');
		}

		return { event: res };
	} catch (e) {
		if (isHttpError(e)) {
			return error(e.status as NumericRange<400, 599>, e.body.message);
		}
	}
}

export const actions = {
	delete: async () => {
		console.log('delete');
	},

	verify: async ({ request, params }) => {
		try {
			const data = await request.formData();
			const participantId = data.get('id');
			const eventId = +params.eventId;

			if (!participantId) {
				return fail(400, { message: 'Invalid participant id' });
			}

			const row = await DB.query.events.findFirst({
				where: (events, { eq }) => eq(events.id, eventId)
			});

			//TODO: add current auth user id
			if (row?.authorId !== 1) {
				return fail(401, { message: 'Unauthorized' });
			}

			await DB.update(participations).set({ verified: true }).where(sql`
							${participations.userId} = ${+participantId} 
							AND
							${participations.eventId} = ${eventId}`);
		} catch (e) {
			console.log(e);
			return fail(400, { message: 'Error verifying participation' });
		}
	},

	participate: async ({ params }) => {
		try {
			await DB.insert(participations).values({
				eventId: +params.eventId,
				userId: 1, //TODO: add auth user
				verified: false
			});
		} catch (e) {
			if (e instanceof Error) {
				const message = e.message.includes('UNIQUE')
					? 'Already participated'
					: 'Failed to participate';

				return fail(400, { message });
			}
		}
	}
};

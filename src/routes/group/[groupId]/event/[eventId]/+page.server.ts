import { error, fail, isHttpError, type NumericRange } from '@sveltejs/kit';
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

	verify: async ({ request }) => {
		const data = await request.formData();
		const participantId = data.get('id');
		console.log('verify', participantId);
	},

	participate: async ({ params }) => {
		try {
			await DB.insert(participations).values({
				eventId: +params.eventId,
				userId: 1, //TODO: add auth user
				verified: false,
				createdAt: new Date()
			});

			return { status: 'success' };
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

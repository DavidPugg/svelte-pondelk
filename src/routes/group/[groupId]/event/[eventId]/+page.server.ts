import { error, isHttpError, type NumericRange } from '@sveltejs/kit';
import { DB } from '../../../../../db/db.js';

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
	}
};

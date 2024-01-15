import { mockEvents } from '$lib/mocks/event.mock.js';
import { mockParticipations } from '$lib/mocks/participation.mock.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const event = mockEvents.find((event) => event.id === params.id);
	const participations = mockParticipations.filter(
		(participation) => participation.event.id === params.id
	);

	if (!event) {
		return error(404, 'Event not found');
	}

	return { event, participations };
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

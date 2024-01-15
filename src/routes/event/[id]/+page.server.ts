import { mockEvents } from '$lib/mocks/event.mock.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const event = mockEvents.find((event) => event.id === params.id);

	if (!event) {
		return error(404, 'Event not found');
	}

	return { event };
}

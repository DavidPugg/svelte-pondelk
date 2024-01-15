import { mockEvents } from '$lib/mocks/event.mock.js';
import { mockGroups } from '$lib/mocks/group.mock';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const group = mockGroups.find((group) => group.id === params.id);
	const events = mockEvents.filter((event) => event.group.id === params.id);

	if (!group) {
		return error(404, 'Group not found');
	}

	return { group, events };
}

export const actions = {
	leave: async () => {
		console.log('leave');
	},

	delete: async () => {
		console.log('delete');
	}
};

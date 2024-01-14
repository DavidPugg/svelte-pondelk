import { mockGroups } from '$lib/mocks/group.mock.js';

export async function load() {
	const groups = mockGroups;
	return { groups };
}

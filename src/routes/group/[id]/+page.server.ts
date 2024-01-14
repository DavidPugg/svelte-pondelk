import { mockGroups } from '$lib/mocks/group.mock';

export async function load({ params }) {
	console.log(params);
	const group = mockGroups.find((group) => group.id === params.id);
	return { group };
}

export const actions = {
	leave: async () => {
		console.log('leave');
	},

	delete: async () => {
		console.log('delete');
	}
};

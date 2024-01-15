import { error, isHttpError, type NumericRange } from '@sveltejs/kit';
import { DB } from '../../../db/db.js';

export async function load({ params }) {
	try {
		const res = await DB.query.groups.findFirst({
			where: (groups, { eq }) => eq(groups.id, +params.groupId),
			with: { events: true }
		});

		if (!res) {
			return error(404, 'Not Found');
		}

		return { group: res };
	} catch (e) {
		if (isHttpError(e)) {
			return error(e.status as NumericRange<400, 599>, e.body.message);
		}
	}
}

export const actions = {
	leave: async () => {
		console.log('leave');
	},

	delete: async () => {
		console.log('delete');
	}
};

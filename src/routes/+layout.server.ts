import type { AuthData } from '$lib/types/auth.js';
import jwt from 'jsonwebtoken';

import 'dotenv/config';

export async function load({ cookies }) {
	const token = cookies.get('token');

	if (!token) {
		return { authData: null };
	}

	const authData = jwt.decode(token) as AuthData;

	return { authData };
}

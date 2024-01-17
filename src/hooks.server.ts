import type { AuthData } from '$lib/types/auth';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('token');

	if (token) {
		const authData = jwt.decode(token);
		event.locals.authData = authData as AuthData;
	}

	return await resolve(event);
}

import type { AuthData } from '$lib/types/auth';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('token');
	event.locals.isAuthenticated = false;

	if (token) {
		const authData = jwt.decode(token);
		event.locals.authData = authData as AuthData;
		event.locals.isAuthenticated = true;
	}

	event.locals.requireAuth = requireAuth(event.locals.isAuthenticated);
	event.locals.requireNoAuth = requireNoAuth(event.locals.isAuthenticated);

	return await resolve(event);
}

function requireAuth(isAuth: boolean) {
	return () => {
		if (!isAuth) throw redirect(303, '/signup');
	};
}

function requireNoAuth(isAuth: boolean) {
	return () => {
		if (isAuth) throw redirect(303, '/');
	};
}

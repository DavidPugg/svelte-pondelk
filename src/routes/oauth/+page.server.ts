import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, SECRET_JWT_KEY } from '$env/static/private';
import type { AuthData } from '$lib/types/auth.js';
import { DB } from '../../db/db.js';
import { users } from '../../db/schema.js';

export async function load({ url, cookies }) {
	const redirectURL = 'http://localhost:5173/oauth';
	const code = url.searchParams.get('code') as string;

	if (!code) {
		throw redirect(303, '/signup');
	}

	try {
		const oAuth2Client = new OAuth2Client(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);
		const r = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(r.tokens);
		const user = oAuth2Client.credentials;

		const ticket = await oAuth2Client.verifyIdToken({
			idToken: user.id_token as string,
			audience: SECRET_CLIENT_ID
		});

		const payload = ticket.getPayload();

		const appUser: AuthData = {
			id: payload?.sub as string,
			username: `${payload?.name}`,
			email: payload?.email as string,
			picture: payload?.picture || null
		};

		const row = await DB.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, appUser.id)
		});

		if (!row) {
			await DB.insert(users).values(appUser);
		}

		const authData = !row ? appUser : row;

		const token = jwt.sign(authData, SECRET_JWT_KEY, {
			expiresIn: '7d'
		});

		cookies.set('token', token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		});

		return { authData };
	} catch (err) {
		console.log('Error logging in with OAuth2 user', err);
		throw redirect(303, '/oauth');
	}
}

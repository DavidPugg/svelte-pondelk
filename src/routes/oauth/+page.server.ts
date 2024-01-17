import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import {
	SECRET_CLIENT_ID,
	SECRET_CLIENT_SECRET,
	SECRET_JWT_KEY,
	SECRET_OAUTH_REDIRECT_URI
} from '$env/static/private';
import type { AuthData } from '$lib/types/auth.js';
import { DB } from '../../db/db.js';
import { users, type NewUserDB, type UserDB } from '../../db/schema.js';

export async function load({ url, cookies }) {
	const code = url.searchParams.get('code') as string;

	if (!code) {
		throw redirect(303, '/signup');
	}

	try {
		const oAuth2Client = new OAuth2Client(
			SECRET_CLIENT_ID,
			SECRET_CLIENT_SECRET,
			SECRET_OAUTH_REDIRECT_URI
		);
		const r = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(r.tokens);
		const user = oAuth2Client.credentials;

		const ticket = await oAuth2Client.verifyIdToken({
			idToken: user.id_token as string,
			audience: SECRET_CLIENT_ID
		});

		const payload = ticket.getPayload();

		const appUser: NewUserDB = {
			sub: payload?.sub as string,
			authType: 'google',
			username: `${payload?.name}`,
			email: payload?.email as string,
			picture: payload?.picture || null
		};

		const row = await authenticate(appUser);

		const authData: AuthData = {
			id: row.id,
			username: row.username,
			email: row.email,
			picture: row.picture
		};

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

async function authenticate(appUser: NewUserDB): Promise<UserDB> {
	const row = await DB.query.users.findFirst({
		where: (users, { eq }) => eq(users.sub, appUser.sub) && eq(users.authType, appUser.authType)
	});

	if (row) {
		return row;
	}

	const [res] = await DB.insert(users).values(appUser).returning();
	return res;
}

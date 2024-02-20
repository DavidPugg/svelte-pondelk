import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { env } from '$env/dynamic/private';
import type { AuthData } from '$lib/types/auth.js';
import { sql } from 'drizzle-orm';
import { DB } from '../../db/db.js';
import { users, type NewUserDB, type UserDB } from '../../db/schema.js';

export async function load({ url, cookies }) {
	const code = url.searchParams.get('code') as string;

	if (!code) {
		throw redirect(303, '/signup');
	}

	try {
		const oAuth2Client = new OAuth2Client(
			env.SECRET_CLIENT_ID,
			env.SECRET_CLIENT_SECRET,
			env.SECRET_OAUTH_REDIRECT_URI
		);
		const r = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(r.tokens);
		const user = oAuth2Client.credentials;

		const ticket = await oAuth2Client.verifyIdToken({
			idToken: user.id_token as string,
			audience: env.SECRET_CLIENT_ID
		});

		const payload = ticket.getPayload();

		const appUser: NewUserDB = {
			sub: payload?.sub as string,
			authType: 'google',
			username: `${payload?.email?.split('@')[0]}-${payload?.sub?.slice(0, 5)}`,
			email: payload?.email as string
		};

		const row = await authenticate(appUser);

		const authData: AuthData = {
			id: row.id,
			username: row.username,
			email: row.email,
			picture: row.picture
		};

		const token = jwt.sign(authData, env.SECRET_JWT_KEY as string, {
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
		where: sql`(${users.sub} = ${appUser.sub} AND ${users.authType} = ${appUser.authType}) OR ${users.email} = ${appUser.email}`
	});

	if (row) {
		return row;
	}

	const [res] = await DB.insert(users).values(appUser).returning();
	return res;
}

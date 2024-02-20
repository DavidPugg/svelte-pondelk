import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';

export const actions = {
	OAuth2: async () => {
		const oAuth2Client = new OAuth2Client(
			env.SECRET_CLIENT_ID,
			env.SECRET_CLIENT_SECRET,
			env.SECRET_OAUTH_REDIRECT_URI
		);

		const authorizeUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope:
				'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
			prompt: 'consent'
		});

		throw redirect(302, authorizeUrl);
	}
};

import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';

export const actions = {
	OAuth2: async () => {
		const oAuth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			process.env.OAUTH_REDIRECT_URI
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

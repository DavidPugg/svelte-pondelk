export function POST({ cookies, locals }) {
	locals.requireAuth();

	cookies.set('token', '', {
		path: '/',
		maxAge: 0,
		httpOnly: true,
		secure: true,
		sameSite: 'strict'
	});

	return new Response('Success');
}

export function POST({ cookies }) {
	cookies.set('token', '', {
		path: '/',
		maxAge: 0,
		httpOnly: true,
		secure: true,
		sameSite: 'strict'
	});
	return new Response('Success');
}

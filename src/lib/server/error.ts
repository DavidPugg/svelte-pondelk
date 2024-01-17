import { error, isHttpError, type NumericRange } from '@sveltejs/kit';

export function throwPageError(e: unknown) {
	let status: NumericRange<400, 599> = 500;
	let message: string = 'Internal Server Error';

	if (isHttpError(e)) {
		status = e.status as NumericRange<400, 599>;
		message = e.body.message;
	}

	return error(status, message);
}

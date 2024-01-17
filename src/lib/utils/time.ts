import dayjs from 'dayjs';

export function getLocalTime(date: Date) {
	const utcOffset = dayjs(date).utcOffset();
	return dayjs(date).add(utcOffset, 'minute').format('YYYY-MM-DD HH:mm:ss');
}

import type { Video } from './types.js';

export function parseFileName(fileName: string): Video {
	const nameParts = fileName.split('_');
	const exercise = nameParts[0] ?? '';
	const date = nameParts[1] ?? '';
	const durationStr = nameParts[2] ?? '0';
	const instructor = nameParts[3] ?? '';
	const type = nameParts[4] ?? '';
	const music = nameParts[5] ?? '';
	const title = nameParts.slice(6).join('_').replace(/\.mp4$/i, '');

	return {
		name: fileName,
		path: fileName,
		exercise,
		date,
		duration: parseInt(durationStr, 10) || 0,
		instructor,
		type,
		music,
		title
	};
}

export function formatDate(dateString: string): string {
	if (!dateString || dateString.length !== 8) return dateString;
	const year = dateString.slice(0, 4);
	const month = parseInt(dateString.slice(4, 6), 10) - 1;
	const day = parseInt(dateString.slice(6, 8), 10);
	const date = new Date(parseInt(year), month, day);
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDuration(minutes: number): string {
	return `${minutes} min`;
}

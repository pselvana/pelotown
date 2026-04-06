import type { PageServerLoad } from './$types.js';
import { scanDirectory } from '$lib/server/scanner.js';
import { getLatestVideos, getPopularVideos } from '$lib/server/videos.js';
import { getWorkoutHistory } from '$lib/server/workouts.js';

export const load: PageServerLoad = async ({ url }) => {
	const view = url.searchParams.get('view') ?? 'all';
	const browsePath = url.searchParams.get('path') ?? '';

	if (view === 'latest') {
		return { view, path: '', workouts: [], ...getLatestVideos() };
	}
	if (view === 'popular') {
		return { view, path: '', workouts: [], ...getPopularVideos() };
	}
	if (view === 'history') {
		return { view, path: '', folders: [], videos: [], workouts: getWorkoutHistory() };
	}

	// Sanitize path
	const safePath = browsePath.replace(/\.\./g, '').replace(/^\//, '');
	return { view, path: safePath, workouts: [], ...scanDirectory(safePath) };
};

import type { PageServerLoad } from './$types.js';
import { scanDirectory } from '$lib/server/scanner.js';
import { getLatestVideos, getPopularVideos } from '$lib/server/videos.js';

export const load: PageServerLoad = async ({ url }) => {
	const view = url.searchParams.get('view') ?? 'all';
	const browsePath = url.searchParams.get('path') ?? '';

	if (view === 'latest') {
		return { view, path: '', ...getLatestVideos() };
	}
	if (view === 'popular') {
		return { view, path: '', ...getPopularVideos() };
	}

	// Sanitize path
	const safePath = browsePath.replace(/\.\./g, '').replace(/^\//, '');
	return { view, path: safePath, ...scanDirectory(safePath) };
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getLatestVideos } from '$lib/server/videos.js';

export const GET: RequestHandler = () => {
	return json(getLatestVideos());
};

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { saveWorkoutSession } from '$lib/server/workouts.js';
import type { WorkoutSummary } from '$lib/types.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json() as { videoPath: string; summary: WorkoutSummary };
		const { videoPath, summary } = body;

		if (!videoPath || !summary) {
			throw error(400, 'Missing videoPath or summary');
		}

		const id = saveWorkoutSession(videoPath, summary);
		return json({ id });
	} catch (err) {
		console.error('[workout/save] Error:', err);
		throw error(500, 'Failed to save workout');
	}
};

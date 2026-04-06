import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getWorkoutHistory } from '$lib/server/workouts.js';

export const GET: RequestHandler = () => {
	try {
		const sessions = getWorkoutHistory();
		return json({ sessions });
	} catch (err) {
		console.error('[workouts] Error:', err);
		throw error(500, 'Failed to load workout history');
	}
};

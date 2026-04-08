import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { saveWorkoutSession, updatePRs } from '$lib/server/workouts.js';
import { updateStreak } from '$lib/server/streaks.js';
import { evaluateAchievements } from '$lib/server/achievements.js';
import { getDb } from '$lib/server/db.js';
import type { WorkoutSummary } from '$lib/types.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json() as { videoPath: string; summary: WorkoutSummary };
		const { videoPath, summary } = body;

		if (!videoPath || !summary) {
			throw error(400, 'Missing videoPath or summary');
		}

		// 1. Save the workout session
		const id = saveWorkoutSession(videoPath, summary);

		// 2. Update streak based on when workout started
		const startedAtSecs = Math.floor(summary.startedAt / 1000);
		const streak = updateStreak(startedAtSecs);

		// 3. Update personal records
		updatePRs(id, summary);

		// 4. Evaluate achievements — need total workout count after this save
		const { count: totalWorkouts } = getDb()
			.prepare(`SELECT COUNT(*) as count FROM workout_sessions`)
			.get() as { count: number };

		const newUnlocks = evaluateAchievements(totalWorkouts, streak.longestCount);

		return json({ id, newUnlocks, streak });
	} catch (err) {
		console.error('[workout/save] Error:', err);
		throw error(500, 'Failed to save workout');
	}
};

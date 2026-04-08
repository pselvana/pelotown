import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getAchievementStates } from '$lib/server/achievements.js';
import { getPRRecords } from '$lib/server/workouts.js';

export const GET: RequestHandler = async () => {
	const achievements = getAchievementStates();
	const prs = getPRRecords();
	return json({ achievements, prs });
};

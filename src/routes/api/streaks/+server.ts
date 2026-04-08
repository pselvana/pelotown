import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getStreak, getWorkoutCalendar } from '$lib/server/streaks.js';

export const GET: RequestHandler = async () => {
	const streak = getStreak();
	const calendar = getWorkoutCalendar(84);
	return json({ streak, calendar });
};

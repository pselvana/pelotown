import { getDb } from './db.js';

export interface StreakState {
	currentCount: number;
	longestCount: number;
	lastWorkoutDate: string; // YYYY-MM-DD
	streakStartDate: string; // YYYY-MM-DD
}

export interface CalendarDay {
	date: string;           // YYYY-MM-DD
	hasWorkout: boolean;
	achievementIds: string[];
}

interface StreakRow {
	id: number;
	current_count: number;
	longest_count: number;
	last_workout_date: string;
	streak_start_date: string;
	grace_used: number;
}

/** Convert a unix-seconds timestamp to a local YYYY-MM-DD string. */
function toLocalDate(unixSecs: number): string {
	const d = new Date(unixSecs * 1000);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

/** Days between two YYYY-MM-DD strings. */
function daysBetween(a: string, b: string): number {
	const msA = new Date(a + 'T00:00:00').getTime();
	const msB = new Date(b + 'T00:00:00').getTime();
	return Math.round((msB - msA) / (1000 * 60 * 60 * 24));
}

/**
 * Update the streak state after a workout completes.
 * Returns the new streak state.
 */
export function updateStreak(workoutUnixSecs: number): StreakState {
	const db = getDb();
	const dateStr = toLocalDate(workoutUnixSecs);

	const state = db
		.prepare(`SELECT * FROM streak_state WHERE id = 1`)
		.get() as StreakRow | undefined;

	// No prior streak state — first workout ever
	if (!state) {
		db.prepare(
			`INSERT INTO streak_state (id, current_count, longest_count, last_workout_date, streak_start_date, grace_used)
       VALUES (1, 1, 1, ?, ?, 0)`
		).run(dateStr, dateStr);
		return { currentCount: 1, longestCount: 1, lastWorkoutDate: dateStr, streakStartDate: dateStr };
	}

	// Same day — no streak change (multiple workouts in one day)
	if (state.last_workout_date === dateStr) {
		return {
			currentCount: state.current_count,
			longestCount: state.longest_count,
			lastWorkoutDate: state.last_workout_date,
			streakStartDate: state.streak_start_date,
		};
	}

	const gap = daysBetween(state.last_workout_date, dateStr);

	let newCurrent: number;
	let newStartDate: string;
	let newGraceUsed: number;

	if (gap === 1) {
		// Consecutive day
		newCurrent = state.current_count + 1;
		newStartDate = state.streak_start_date;
		newGraceUsed = state.grace_used;
	} else if (gap === 2 && !state.grace_used) {
		// One missed day — use grace to recover streak
		newCurrent = state.current_count + 1;
		newStartDate = state.streak_start_date;
		newGraceUsed = 1;
	} else {
		// Streak broken — reset
		newCurrent = 1;
		newStartDate = dateStr;
		newGraceUsed = 0;
	}

	const newLongest = Math.max(state.longest_count, newCurrent);

	db.prepare(
		`UPDATE streak_state
     SET current_count = ?, longest_count = ?, last_workout_date = ?,
         streak_start_date = ?, grace_used = ?
     WHERE id = 1`
	).run(newCurrent, newLongest, dateStr, newStartDate, newGraceUsed);

	return {
		currentCount: newCurrent,
		longestCount: newLongest,
		lastWorkoutDate: dateStr,
		streakStartDate: newStartDate,
	};
}

/** Get current streak state without modifying anything. */
export function getStreak(): StreakState {
	const db = getDb();
	const state = db
		.prepare(`SELECT * FROM streak_state WHERE id = 1`)
		.get() as StreakRow | undefined;

	return {
		currentCount: state?.current_count ?? 0,
		longestCount: state?.longest_count ?? 0,
		lastWorkoutDate: state?.last_workout_date ?? '',
		streakStartDate: state?.streak_start_date ?? '',
	};
}

/** Return calendar days for the last `days` days (inclusive of today), oldest first. */
export function getWorkoutCalendar(days = 84): CalendarDay[] {
	const db = getDb();
	const sinceUnix = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

	const sessions = db
		.prepare(`SELECT started_at FROM workout_sessions WHERE started_at >= ? ORDER BY started_at ASC`)
		.all(sinceUnix) as { started_at: number }[];

	const workoutDates = new Set(sessions.map(s => toLocalDate(s.started_at)));

	const achievementsByDate = new Map<string, string[]>();
	const unlocks = db
		.prepare(`SELECT achievement_id, unlocked_at FROM achievement_unlocks WHERE unlocked_at >= ?`)
		.all(sinceUnix) as { achievement_id: string; unlocked_at: number }[];

	for (const u of unlocks) {
		const d = toLocalDate(u.unlocked_at);
		if (!achievementsByDate.has(d)) achievementsByDate.set(d, []);
		achievementsByDate.get(d)!.push(u.achievement_id);
	}

	const result: CalendarDay[] = [];
	const today = new Date();

	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		result.push({
			date: dateStr,
			hasWorkout: workoutDates.has(dateStr),
			achievementIds: achievementsByDate.get(dateStr) ?? [],
		});
	}

	return result;
}

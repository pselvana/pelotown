import { getDb } from './db.js';
import { parseFileName } from '../utils.js';
import type { WorkoutSummary, WorkoutSession, PRRecord } from '../types.js';
import path from 'path';

export function saveWorkoutSession(videoPath: string, summary: WorkoutSummary): number {
	const db = getDb();

	const fileName = path.basename(videoPath);
	const parsed = parseFileName(fileName);
	const videoTitle = parsed.title || parsed.instructor || fileName.replace('.mp4', '');

	const result = db
		.prepare(
			`INSERT INTO workout_sessions
        (video_path, video_title, started_at, ended_at, duration_secs,
         avg_cadence, max_cadence, avg_resistance, max_resistance,
         avg_power, max_power, avg_speed, total_output, calories)
       VALUES
        (@video_path, @video_title, @started_at, @ended_at, @duration_secs,
         @avg_cadence, @max_cadence, @avg_resistance, @max_resistance,
         @avg_power, @max_power, @avg_speed, @total_output, @calories)`
		)
		.run({
			video_path: videoPath,
			video_title: videoTitle,
			started_at: Math.floor(summary.startedAt / 1000),
			ended_at: Math.floor(summary.endedAt / 1000),
			duration_secs: summary.durationSecs,
			avg_cadence: summary.avgCadence,
			max_cadence: summary.maxCadence,
			avg_resistance: summary.avgResistance,
			max_resistance: summary.maxResistance,
			avg_power: summary.avgPower,
			max_power: summary.maxPower,
			avg_speed: summary.avgSpeed,
			total_output: summary.totalOutput,
			calories: summary.calories
		});

	return result.lastInsertRowid as number;
}

/**
 * Update personal records after a workout. Returns which metrics had new PRs set.
 * Tracks: max_power (W), total_output (kJ), duration_secs (s).
 */
export function updatePRs(
	sessionId: number,
	summary: Pick<WorkoutSummary, 'maxPower' | 'totalOutput' | 'durationSecs'>
): string[] {
	const db = getDb();
	const now = Math.floor(Date.now() / 1000);

	const candidates: { metric: string; value: number }[] = [
		{ metric: 'max_power',     value: summary.maxPower },
		{ metric: 'total_output',  value: summary.totalOutput },
		{ metric: 'duration_secs', value: summary.durationSecs },
	];

	const beaten: string[] = [];

	for (const { metric, value } of candidates) {
		if (value <= 0) continue;
		const existing = db
			.prepare(`SELECT best_value FROM pr_records WHERE metric = ?`)
			.get(metric) as { best_value: number } | undefined;

		if (!existing) {
			db.prepare(
				`INSERT INTO pr_records (metric, best_value, session_id, set_at) VALUES (?, ?, ?, ?)`
			).run(metric, value, sessionId, now);
			beaten.push(metric);
		} else if (value > existing.best_value) {
			db.prepare(
				`UPDATE pr_records SET best_value = ?, session_id = ?, set_at = ? WHERE metric = ?`
			).run(value, sessionId, now, metric);
			beaten.push(metric);
		}
	}

	return beaten;
}

export function getPRRecords(): PRRecord[] {
	const db = getDb();
	const rows = db
		.prepare(`SELECT metric, best_value, set_at FROM pr_records`)
		.all() as { metric: string; best_value: number; set_at: number }[];

	return rows.map(r => ({
		metric: r.metric,
		bestValue: r.best_value,
		setAt: r.set_at * 1000,
	}));
}

export function getWorkoutHistory(limit = 50): WorkoutSession[] {
	const db = getDb();
	return db
		.prepare(
			`SELECT * FROM workout_sessions ORDER BY started_at DESC LIMIT ?`
		)
		.all(limit) as WorkoutSession[];
}

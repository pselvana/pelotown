import { getDb } from './db.js';
import { parseFileName } from '../utils.js';
import type { WorkoutSummary, WorkoutSession } from '../types.js';
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

export function getWorkoutHistory(limit = 50): WorkoutSession[] {
	const db = getDb();
	return db
		.prepare(
			`SELECT * FROM workout_sessions ORDER BY started_at DESC LIMIT ?`
		)
		.all(limit) as WorkoutSession[];
}

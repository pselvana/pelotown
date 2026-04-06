import fs from 'fs';
import path from 'path';
import { getDb } from './db.js';
import { parseFileName } from '../utils.js';
import type { Video } from '../types.js';

const VIDEOS_PATH = process.env.VIDEOS_PATH ?? path.join(process.cwd(), 'videos');

export function getLatestVideos(): { folders: never[]; videos: Video[] } {
	const db = getDb();

	const rows = db
		.prepare(
			`
    SELECT v.*
    FROM videos v
    INNER JOIN (
      SELECT video_id, MAX(played_at) AS last_played
      FROM plays
      GROUP BY video_id
      ORDER BY last_played DESC
      LIMIT 25
    ) r ON v.id = r.video_id
    ORDER BY r.last_played DESC
  `
		)
		.all() as Video[];

	return { folders: [], videos: rows };
}

export function getPopularVideos(): { folders: never[]; videos: Video[] } {
	const db = getDb();

	const rows = db
		.prepare(
			`
    SELECT v.*, COUNT(p.id) AS play_count
    FROM videos v
    INNER JOIN plays p ON v.id = p.video_id
    GROUP BY v.id
    ORDER BY play_count DESC
    LIMIT 25
  `
		)
		.all() as Video[];

	return { folders: [], videos: rows };
}

export function recordPlay(relativePath: string): void {
	const db = getDb();
	const now = Math.floor(Date.now() / 1000);

	// Ensure the video exists in the DB (may not have been scanned yet)
	const existing = db.prepare('SELECT id FROM videos WHERE path = ?').get(relativePath) as
		| { id: number }
		| undefined;

	if (!existing) {
		// Try to parse from filename for on-the-fly insert
		const fileName = path.basename(relativePath);
		const parsed = parseFileName(fileName);
		try {
			const videoPath = path.join(VIDEOS_PATH, relativePath);
			const size = fs.existsSync(videoPath) ? fs.statSync(videoPath).size : 0;
			db.prepare(
				`INSERT OR IGNORE INTO videos
          (name, path, exercise, date, duration, instructor, type, music, title, file_size, discovered_at, last_seen_at)
          VALUES (@name, @path, @exercise, @date, @duration, @instructor, @type, @music, @title, @size, @now, @now)`
			).run({
				name: parsed.name,
				path: relativePath,
				exercise: parsed.exercise,
				date: parsed.date,
				duration: parsed.duration,
				instructor: parsed.instructor,
				type: parsed.type,
				music: parsed.music,
				title: parsed.title,
				size,
				now
			});
		} catch {
			// Best effort
		}
	}

	db.prepare(
		'INSERT INTO plays (video_id, played_at) SELECT id, ? FROM videos WHERE path = ?'
	).run(now, relativePath);
}

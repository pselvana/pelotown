import fs from 'fs';
import path from 'path';
import { getDb } from './db.js';
import { parseFileName } from '../utils.js';

const STATS_PATH = process.env.STATS_PATH ?? path.join(process.cwd(), 'stats');

export function migrateStatsFiles(): void {
	const db = getDb();

	const alreadyRun = db.prepare("SELECT id FROM migrations WHERE name = 'stats_to_plays'").get();
	if (alreadyRun) return;

	if (!fs.existsSync(STATS_PATH)) {
		db.prepare("INSERT INTO migrations (name, run_at) VALUES ('stats_to_plays', unixepoch())").run();
		console.log('[Migration] No legacy stats directory found, skipping.');
		return;
	}

	let files: string[];
	try {
		files = fs.readdirSync(STATS_PATH).filter((f) => f.endsWith('.txt')).sort();
	} catch {
		console.warn('[Migration] Could not read stats directory, skipping.');
		return;
	}

	const insertVideo = db.prepare(`
    INSERT OR IGNORE INTO videos
      (name, path, exercise, date, duration, instructor, type, music, title,
       file_size, discovered_at, last_seen_at)
    VALUES
      (@name, @path, @exercise, @date, @duration, @instructor, @type, @music, @title,
       0, @ts, @ts)
  `);

	const insertPlay = db.prepare(`
    INSERT INTO plays (video_id, played_at)
    SELECT id, @ts FROM videos WHERE path = @path
  `);

	const markDone = db.prepare(
		"INSERT INTO migrations (name, run_at) VALUES ('stats_to_plays', unixepoch())"
	);

	const migrate = db.transaction(() => {
		for (const file of files) {
			const ts = parseInt(file.replace('.txt', ''), 10);
			if (isNaN(ts)) continue;

			let videoName: string;
			try {
				videoName = fs.readFileSync(path.join(STATS_PATH, file), 'utf8').trim();
			} catch {
				continue;
			}
			if (!videoName) continue;

			const parsed = parseFileName(videoName);
			insertVideo.run({ ...parsed, path: videoName, ts });
			insertPlay.run({ path: videoName, ts });
		}
		markDone.run();
	});

	try {
		migrate();
		console.log(`[Migration] Migrated ${files.length} play records from legacy stats files.`);
	} catch (err) {
		console.error('[Migration] Failed:', err);
	}
}

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = process.env.VIDEOS_PATH ?? path.join(process.cwd(), 'videos');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (_db) return _db;

	// Ensure videos directory exists
	if (!fs.existsSync(VIDEOS_PATH)) {
		fs.mkdirSync(VIDEOS_PATH, { recursive: true });
	}

	const dbPath = path.join(VIDEOS_PATH, 'pelotown.db');
	_db = new Database(dbPath);
	_db.pragma('journal_mode = WAL');
	_db.pragma('foreign_keys = ON');
	return _db;
}

export function initDb(): void {
	const db = getDb();

	db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      path          TEXT    NOT NULL UNIQUE,
      exercise      TEXT    NOT NULL DEFAULT '',
      date          TEXT    NOT NULL DEFAULT '',
      duration      INTEGER NOT NULL DEFAULT 0,
      instructor    TEXT    NOT NULL DEFAULT '',
      type          TEXT    NOT NULL DEFAULT '',
      music         TEXT    NOT NULL DEFAULT '',
      title         TEXT    NOT NULL DEFAULT '',
      file_size     INTEGER NOT NULL DEFAULT 0,
      discovered_at INTEGER NOT NULL,
      last_seen_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plays (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id  INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
      played_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS migrations (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      name   TEXT NOT NULL UNIQUE,
      run_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_plays_video_id  ON plays(video_id);
    CREATE INDEX IF NOT EXISTS idx_plays_played_at ON plays(played_at DESC);
    CREATE INDEX IF NOT EXISTS idx_videos_date     ON videos(date DESC);
    CREATE INDEX IF NOT EXISTS idx_videos_path     ON videos(path);
  `);
}

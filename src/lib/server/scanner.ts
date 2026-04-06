import fs from 'fs';
import path from 'path';
import { getDb } from './db.js';
import { parseFileName } from '../utils.js';

const VIDEOS_PATH = process.env.VIDEOS_PATH ?? path.join(process.cwd(), 'videos');

interface FileEntry {
	name: string;
	relativePath: string;
	size: number;
}

function walkMp4s(dirPath: string, relativePath = ''): FileEntry[] {
	const results: FileEntry[] = [];

	if (!fs.existsSync(dirPath)) return results;

	let items: string[];
	try {
		items = fs.readdirSync(dirPath);
	} catch {
		return results;
	}

	for (const item of items) {
		if (item.startsWith('.') || item.startsWith('@')) continue;
		// Skip the database file itself
		if (item === 'pelotown.db' || item === 'pelotown.db-wal' || item === 'pelotown.db-shm') continue;

		const fullPath = path.join(dirPath, item);
		let stat: fs.Stats;
		try {
			stat = fs.statSync(fullPath);
		} catch {
			continue;
		}

		if (stat.isDirectory()) {
			const sub = walkMp4s(fullPath, path.join(relativePath, item));
			results.push(...sub);
		} else if (stat.isFile() && path.extname(item).toLowerCase() === '.mp4') {
			results.push({
				name: item,
				relativePath: path.join(relativePath, item),
				size: stat.size
			});
		}
	}

	return results;
}

export function scanVideos(): void {
	const db = getDb();
	const now = Math.floor(Date.now() / 1000);

	const files = walkMp4s(VIDEOS_PATH);

	const upsert = db.prepare(`
    INSERT INTO videos (name, path, exercise, date, duration, instructor, type, music, title, file_size, discovered_at, last_seen_at)
    VALUES (@name, @path, @exercise, @date, @duration, @instructor, @type, @music, @title, @file_size, @now, @now)
    ON CONFLICT(path) DO UPDATE SET
      last_seen_at = @now,
      file_size    = @file_size
  `);

	const scanAll = db.transaction((entries: FileEntry[]) => {
		for (const file of entries) {
			const parsed = parseFileName(file.name);
			upsert.run({
				name: parsed.name,
				path: file.relativePath,
				exercise: parsed.exercise,
				date: parsed.date,
				duration: parsed.duration,
				instructor: parsed.instructor,
				type: parsed.type,
				music: parsed.music,
				title: parsed.title,
				file_size: file.size,
				now
			});
		}
	});

	scanAll(files);
	console.log(`[Scanner] Scanned ${files.length} videos at ${new Date().toISOString()}`);
}

export function scanDirectory(relativePath = ''): { folders: { name: string; path: string }[]; videos: ReturnType<typeof parseFileName>[] } {
	const dirPath = path.join(VIDEOS_PATH, relativePath);
	const result: { folders: { name: string; path: string }[]; videos: ReturnType<typeof parseFileName>[] } = {
		folders: [],
		videos: []
	};

	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		return result;
	}

	let items: string[];
	try {
		items = fs.readdirSync(dirPath);
	} catch {
		return result;
	}

	for (const item of items) {
		if (item.startsWith('.') || item.startsWith('@')) continue;
		if (item === 'pelotown.db' || item === 'pelotown.db-wal' || item === 'pelotown.db-shm') continue;

		const fullPath = path.join(dirPath, item);
		let stat: fs.Stats;
		try {
			stat = fs.statSync(fullPath);
		} catch {
			continue;
		}

		if (stat.isDirectory()) {
			result.folders.push({
				name: item,
				path: relativePath ? `${relativePath}/${item}` : item
			});
		} else if (stat.isFile() && path.extname(item).toLowerCase() === '.mp4') {
			const parsed = parseFileName(item);
			parsed.path = relativePath ? `${relativePath}/${item}` : item;
			result.videos.push(parsed);
		}
	}

	result.videos.sort((a, b) => b.date.localeCompare(a.date));
	return result;
}

import type { Handle } from '@sveltejs/kit';
import { initDb } from '$lib/server/db.js';
import { scanVideos } from '$lib/server/scanner.js';
import { migrateStatsFiles } from '$lib/server/migrate.js';

// Singleton guard — survives Vite HMR module re-evaluation
declare global {
	// eslint-disable-next-line no-var
	var _appInitialized: boolean | undefined;
}

if (!global._appInitialized) {
	global._appInitialized = true;

	try {
		initDb();
		migrateStatsFiles();
		scanVideos();
		setInterval(() => {
			try {
				scanVideos();
			} catch (err) {
				console.error('[Scanner] Error during periodic scan:', err);
			}
		}, 15 * 60 * 1000);
	} catch (err) {
		console.error('[Init] Startup error:', err);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

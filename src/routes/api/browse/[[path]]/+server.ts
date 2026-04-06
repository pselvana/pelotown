import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { scanDirectory } from '$lib/server/scanner.js';

export const GET: RequestHandler = ({ params }) => {
	const rawPath = (params.path ?? '').replace(/\.\./g, '').replace(/^\//, '');
	try {
		const result = scanDirectory(rawPath);
		return json(result);
	} catch (err) {
		console.error('[Browse API] Error:', err);
		throw error(500, 'Failed to read directory');
	}
};

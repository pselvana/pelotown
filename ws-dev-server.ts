// Dev-only WebSocket server running on port 3001
// Run alongside `vite dev` via: npm run dev
import { WebSocketServer, WebSocket } from 'ws';

const clients = new Set<WebSocket>();
let currentMetrics = { cadence: 0, resistance: 0 };

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
	clients.add(ws);
	ws.send(JSON.stringify(currentMetrics));

	ws.on('message', (raw) => {
		try {
			const data = JSON.parse(raw.toString()) as Partial<typeof currentMetrics>;
			if ('cadence' in data && typeof data.cadence === 'number') {
				currentMetrics.cadence = data.cadence;
			}
			if ('resistance' in data && typeof data.resistance === 'number') {
				currentMetrics.resistance = data.resistance;
			}
			const msg = JSON.stringify(currentMetrics);
			for (const client of clients) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(msg);
				}
			}
		} catch {
			// Ignore malformed messages
		}
	});

	ws.on('close', () => clients.delete(ws));
	ws.on('error', (err) => console.error('[WS-Dev] Client error:', err));
});

wss.on('listening', () => console.log('[WS-Dev] WebSocket server listening on ws://localhost:3001'));
wss.on('error', (err) => console.error('[WS-Dev] Server error:', err));

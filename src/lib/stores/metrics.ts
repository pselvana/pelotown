import { writable } from 'svelte/store';
import type { Metrics } from '../types.js';

export const metrics = writable<Metrics>({ cadence: 0, resistance: 0, speed: 0, power: 0 });
export const metricsConnected = writable(false);

export function connectMetrics(wsUrl: string): WebSocket {
	const ws = new WebSocket(wsUrl);

	ws.onopen = () => metricsConnected.set(true);

	ws.onmessage = (e: MessageEvent) => {
		try {
			const { cadence, resistance } = JSON.parse(e.data as string) as {
				cadence: number;
				resistance: number;
			};
			const power = Math.round((resistance * cadence * cadence) / 30);
			const speed = Math.round(resistance * 30 * 3.6 * 10) / 10;
			metrics.set({ cadence, resistance, speed, power });
		} catch {
			// ignore
		}
	};

	ws.onclose = () => {
		metricsConnected.set(false);
		setTimeout(() => connectMetrics(wsUrl), 3000);
	};

	ws.onerror = () => {
		// Will trigger onclose which handles reconnect
	};

	return ws;
}

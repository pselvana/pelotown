import { writable, get } from 'svelte/store';
import type { Metrics } from '../types.js';
import { profile } from './profile.js';

export const metrics = writable<Metrics>({ cadence: 0, resistance: 0, speed: 0, power: 0 });
export const metricsConnected = writable(false);

// Power multiplier k per bike model (resistance * cadence * k = watts)
const POWER_K: Record<string, number> = {
	bike: 2.0,
	bike_plus: 3.0
};

export function connectMetrics(wsUrl: string): WebSocket {
	const ws = new WebSocket(wsUrl);

	ws.onopen = () => metricsConnected.set(true);

	ws.onmessage = (e: MessageEvent) => {
		try {
			const { cadence, resistance } = JSON.parse(e.data as string) as {
				cadence: number;
				resistance: number;
			};
			const { bikeModel } = get(profile);
			const k = POWER_K[bikeModel] ?? 2.0;
			// Speed: Peloton wheel circumference formula — cadence * 0.233 km/h
			const speed = Math.round(cadence * 0.233 * 10) / 10;
			// Power: resistance * cadence * k (k=2.0 Bike, k=3.0 Bike+)
			const power = Math.round(resistance * cadence * k);
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

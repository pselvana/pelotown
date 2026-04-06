import { writable, get } from 'svelte/store';
import type { Metrics } from '../types.js';
import { profile } from './profile.js';

export type MetricsStatus = 'disconnected' | 'reconnecting' | 'connected';

export const metrics = writable<Metrics>({ cadence: 0, resistance: 0, speed: 0, power: 0 });
export const metricsConnected = writable(false);
export const metricsStatus = writable<MetricsStatus>('disconnected');

// Power multiplier k per bike model (resistance * cadence * k = watts)
const POWER_K: Record<string, number> = {
	bike: 2.0,
	bike_plus: 3.0
};

const DATA_TIMEOUT_MS = 3000;

export function connectMetrics(wsUrl: string): WebSocket {
	const ws = new WebSocket(wsUrl);
	let dataTimer: ReturnType<typeof setTimeout> | null = null;

	function scheduleDataTimeout() {
		if (dataTimer !== null) clearTimeout(dataTimer);
		dataTimer = setTimeout(() => {
			// Socket still open but no data for 3s — bike has gone quiet
			metricsStatus.set('reconnecting');
		}, DATA_TIMEOUT_MS);
	}

	ws.onopen = () => {
		metricsConnected.set(true);
		// Stay in current status until data actually arrives
	};

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
			metricsStatus.set('connected');
			scheduleDataTimeout();
		} catch {
			// ignore
		}
	};

	ws.onclose = () => {
		if (dataTimer !== null) {
			clearTimeout(dataTimer);
			dataTimer = null;
		}
		metricsConnected.set(false);
		metricsStatus.set('reconnecting');
		setTimeout(() => connectMetrics(wsUrl), 3000);
	};

	ws.onerror = () => {
		// Will trigger onclose which handles reconnect
	};

	return ws;
}

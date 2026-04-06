import { writable, get } from 'svelte/store';
import { metrics } from './metrics.js';
import type { WorkoutSample, WorkoutSummary } from '../types.js';

export const sessionActive = writable(false);
export const sessionSamples = writable<WorkoutSample[]>([]);

const SAMPLE_INTERVAL_MS = 1000; // max 1 sample per second

let sessionStart = 0;
let lastSampleTime = 0;
let unsub: (() => void) | null = null;

export function startSession(): void {
	sessionStart = Date.now();
	lastSampleTime = 0;
	sessionSamples.set([]);
	sessionActive.set(true);

	unsub = metrics.subscribe((m) => {
		const now = Date.now();
		if (now - lastSampleTime >= SAMPLE_INTERVAL_MS && (m.cadence > 0 || m.resistance > 0)) {
			lastSampleTime = now;
			sessionSamples.update((s) => [
				...s,
				{ t: now, cadence: m.cadence, resistance: m.resistance, speed: m.speed, power: m.power }
			]);
		}
	});
}

export function stopSession(): WorkoutSummary | null {
	if (unsub) {
		unsub();
		unsub = null;
	}
	sessionActive.set(false);

	const samples = get(sessionSamples);
	if (samples.length < 5) return null; // not enough data for a meaningful summary

	const endedAt = Date.now();
	const durationSecs = Math.round((endedAt - sessionStart) / 1000);

	const cadences = samples.map((s) => s.cadence);
	const resistances = samples.map((s) => s.resistance);
	const powers = samples.map((s) => s.power);
	const speeds = samples.map((s) => s.speed);

	// Total output in kJ: Σ(power[i] * dt[i]) / 1000
	let totalOutputJ = 0;
	for (let i = 1; i < samples.length; i++) {
		const dt = (samples[i].t - samples[i - 1].t) / 1000;
		totalOutputJ += samples[i].power * Math.min(dt, 10); // cap dt at 10s for gaps
	}
	const totalOutput = Math.round((totalOutputJ / 1000) * 10) / 10;

	// Calories: ~4 kcal per kJ of mechanical work (25% efficiency)
	const calories = Math.round(totalOutput * 4);

	return {
		startedAt: sessionStart,
		endedAt,
		durationSecs,
		samples,
		avgCadence: Math.round(mean(cadences)),
		maxCadence: Math.max(...cadences),
		avgResistance: Math.round(mean(resistances)),
		maxResistance: Math.max(...resistances),
		avgPower: Math.round(mean(powers)),
		maxPower: Math.max(...powers),
		avgSpeed: Math.round(mean(speeds) * 10) / 10,
		totalOutput,
		calories
	};
}

function mean(arr: number[]): number {
	return arr.reduce((a, b) => a + b, 0) / arr.length;
}

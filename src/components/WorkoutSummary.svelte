<script lang="ts">
	import { onMount } from 'svelte';
	import type { WorkoutSummary } from '$lib/types.js';
	import PowerGraph from './PowerGraph.svelte';

	interface Props {
		summary: WorkoutSummary;
		videoPath: string;
		videoTitle: string;
		onDone: () => void;
	}
	let { summary, videoPath, videoTitle, onDone }: Props = $props();

	function fmtDuration(secs: number): string {
		const h = Math.floor(secs / 3600);
		const m = Math.floor((secs % 3600) / 60);
		const s = secs % 60;
		if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function fmtTime(ms: number): string {
		return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	onMount(() => {
		// Fire-and-forget save to DB
		fetch('/api/workout/save', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ videoPath, summary })
		}).catch(() => {});
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onDone();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="fixed inset-0 z-60 bg-base-100 flex flex-col items-center justify-center overflow-auto py-8 px-4">
	<!-- Header -->
	<div class="text-center mb-8">
		<div class="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-1">Workout Complete</div>
		<h1 class="text-3xl font-bold text-base-content">{videoTitle || 'Workout Summary'}</h1>
		<div class="text-sm text-base-content/40 mt-1">
			{fmtTime(summary.startedAt)} – {fmtTime(summary.endedAt)}
		</div>
	</div>

	<!-- Hero stat: Total Output -->
	<div class="mb-8 text-center">
		<div class="text-7xl font-bold tabular-nums text-primary">{summary.totalOutput}</div>
		<div class="text-sm font-semibold uppercase tracking-widest text-base-content/50 mt-1">kJ Total Output</div>
	</div>

	<!-- Stats grid -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
		<!-- Duration -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{fmtDuration(summary.durationSecs)}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Duration</div>
		</div>

		<!-- Calories -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-secondary">{summary.calories}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Calories</div>
		</div>

		<!-- Avg Power -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{summary.avgPower}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Avg Watts</div>
		</div>

		<!-- Max Power -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{summary.maxPower}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Max Watts</div>
		</div>

		<!-- Avg Cadence -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{summary.avgCadence}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Avg Cadence</div>
		</div>

		<!-- Max Cadence -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{summary.maxCadence}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Max Cadence</div>
		</div>

		<!-- Avg Resistance -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{summary.avgResistance}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Avg Resist %</div>
		</div>

		<!-- Avg Speed -->
		<div class="rounded-2xl bg-base-200 p-4 text-center">
			<div class="text-3xl font-bold tabular-nums text-base-content">{summary.avgSpeed}</div>
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">Avg km/h</div>
		</div>
	</div>

	<!-- Power graph -->
	{#if summary.samples.length >= 2}
		<div class="w-full max-w-2xl mb-8">
			<div class="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">Power Output</div>
			<div class="rounded-2xl bg-base-200 p-4 overflow-hidden">
				<PowerGraph samples={summary.samples} />
			</div>
		</div>
	{/if}

	<!-- Done button -->
	<button class="btn btn-primary btn-lg rounded-full px-12" onclick={onDone}>
		Done
	</button>
</div>

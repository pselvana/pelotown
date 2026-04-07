<script lang="ts">
	import { metrics } from '$lib/stores/metrics.js';
	import { sessionSamples, startSession, stopSession } from '$lib/stores/session.js';
	import { parseFileName } from '$lib/utils.js';
	import MetricTile from './MetricTile.svelte';
	import WsStatus from './WsStatus.svelte';
	import PowerGraph from './PowerGraph.svelte';
	import PowerZoneBar from './PowerZoneBar.svelte';
	import { profile } from '$lib/stores/profile.js';
	import WorkoutSummary from './WorkoutSummary.svelte';
	import type { WorkoutSummary as WorkoutSummaryType } from '$lib/types.js';

	interface Props {
		videoPath: string | null;
		onClose: () => void;
	}
	let { videoPath, onClose }: Props = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);
	let summaryData = $state<WorkoutSummaryType | null>(null);
	let videoTitle = $state('');

	// Track which path the session was started for to avoid double-starts
	let _trackedPath: string | null = null;

	$effect(() => {
		// Reset session state whenever videoPath changes (doesn't need videoEl)
		if (videoPath !== _trackedPath) {
			_trackedPath = videoPath;
			if (videoPath) {
				summaryData = null;
				const parsed = parseFileName(videoPath.split('/').pop() ?? '');
				videoTitle = [parsed.title, parsed.instructor].filter(Boolean).join(' · ') || videoPath;
				startSession();
			}
		}
		// Start playback once video element is mounted (after summaryData = null re-renders)
		if (videoPath && videoEl) {
			videoEl.src = `/videos/${videoPath}`;
			videoEl.play().catch(() => {});
		}
	});

	function handleClose() {
		if (videoEl) videoEl.pause();
		const summary = stopSession();
		if (summary) {
			summaryData = summary;
		} else {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (summaryData) {
				onClose();
			} else {
				handleClose();
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if videoPath}
	<div class="player-view fixed inset-0 z-50 bg-base-100 flex items-center justify-center">

		{#if summaryData}
			<!-- Post-workout summary -->
			<WorkoutSummary
				summary={summaryData}
				{videoPath}
				{videoTitle}
				onDone={onClose}
			/>
		{:else}
			<!-- Video -->
			<video
				bind:this={videoEl}
				class="w-full h-full object-contain"
				controls
				onended={handleClose}
			></video>

			<!-- Bottom overlay: graph + zones + metrics -->
			<div class="absolute bottom-0 left-0 right-0 backdrop-blur-2xl bg-base-300/75 border-t border-base-content/10 px-6 pt-3 pb-4">
				<!-- Zone bar row -->
				{#if $profile.ftp !== null}
					<div class="mb-2">
						<PowerZoneBar />
					</div>
				{/if}

				<!-- Power graph -->
				<PowerGraph samples={$sessionSamples} />

				<!-- Metrics row -->
				<div class="flex items-center gap-6 mt-3">
					<WsStatus large />
					<MetricTile label="Cadence" value={$metrics.cadence} unit="RPM" large />
					<MetricTile label="Resistance" value={$metrics.resistance} unit="%" large />
					<MetricTile label="Speed" value={$metrics.speed} unit="KM/H" large />
					<MetricTile label="Power" value={$metrics.power} unit="W" large />
				</div>
			</div>

			<!-- Close button -->
			<button
				class="btn btn-circle btn-ghost absolute top-4 right-4 backdrop-blur-2xl bg-base-300/60 border border-base-content/10"
				onclick={handleClose}
				aria-label="Close player"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

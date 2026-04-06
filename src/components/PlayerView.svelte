<script lang="ts">
	import { metrics } from '$lib/stores/metrics.js';
	import MetricTile from './MetricTile.svelte';
	import WsStatus from './WsStatus.svelte';

	interface Props {
		videoPath: string | null;
		onClose: () => void;
	}
	let { videoPath, onClose }: Props = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);

	$effect(() => {
		if (videoPath && videoEl) {
			videoEl.src = `/videos/${videoPath}`;
			videoEl.play().catch(() => {});
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if videoPath}
	<div
		class="player-view fixed inset-0 z-50 bg-base-100 flex items-center justify-center"
	>
		<!-- Video -->
		<video
			bind:this={videoEl}
			class="w-full h-full object-contain"
			controls
		></video>

		<!-- Metrics overlay (bottom-left) -->
		<div
			class="absolute bottom-6 left-6 flex flex-col gap-3 rounded-2xl backdrop-blur-2xl bg-base-300/60 p-4 border border-base-content/10"
		>
			<WsStatus large />
			<div class="flex gap-6">
				<MetricTile label="Cadence" value={$metrics.cadence} unit="RPM" large />
				<MetricTile label="Resistance" value={$metrics.resistance} unit="%" large />
				<MetricTile label="Speed" value={$metrics.speed} unit="KM/H" large />
				<MetricTile label="Power" value={$metrics.power} unit="W" large />
			</div>
		</div>

		<!-- Close button -->
		<button
			class="btn btn-circle btn-ghost absolute top-4 right-4 backdrop-blur-2xl bg-base-300/60 border border-base-content/10"
			onclick={onClose}
			aria-label="Close player"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/if}

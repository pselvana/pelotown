<script lang="ts">
	import { metrics, metricsConnected } from '$lib/stores/metrics.js';
	import { profile } from '$lib/stores/profile.js';
	import MetricTile from './MetricTile.svelte';

	const KMH_TO_MPH = 0.621371;

	let displaySpeed = $derived(
		$profile.speedUnit === 'mph'
			? Math.round($metrics.speed * KMH_TO_MPH * 10) / 10
			: $metrics.speed
	);
	let speedLabel = $derived($profile.speedUnit === 'mph' ? 'MPH' : 'KM/H');
</script>

{#if $metricsConnected && ($metrics.cadence > 0 || $metrics.resistance > 0)}
	<div class="live-metrics-bar flex items-center gap-6 rounded-2xl bg-base-200 px-6 py-3 mb-4">
		<div class="flex items-center gap-2 mr-2">
			<span class="badge badge-error badge-sm animate-pulse">LIVE</span>
		</div>
		<MetricTile label="Cadence" value={$metrics.cadence} unit="RPM" />
		<div class="divider divider-horizontal m-0 h-8 self-center"></div>
		<MetricTile label="Resistance" value={$metrics.resistance} unit="%" />
		<div class="divider divider-horizontal m-0 h-8 self-center"></div>
		<MetricTile label="Speed" value={displaySpeed} unit={speedLabel} />
		<div class="divider divider-horizontal m-0 h-8 self-center"></div>
		<MetricTile label="Power" value={$metrics.power} unit="W" />
	</div>
{/if}

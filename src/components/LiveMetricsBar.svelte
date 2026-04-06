<script lang="ts">
	import { metrics, metricsConnected } from '$lib/stores/metrics.js';
	import MetricTile from './MetricTile.svelte';
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
		<MetricTile label="Speed" value={$metrics.speed} unit="KM/H" />
		<div class="divider divider-horizontal m-0 h-8 self-center"></div>
		<MetricTile label="Power" value={$metrics.power} unit="W" />
	</div>
{/if}

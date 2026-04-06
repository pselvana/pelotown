<script lang="ts">
	import { metricsStatus } from '$lib/stores/metrics.js';

	interface Props {
		large?: boolean;
	}
	let { large = false }: Props = $props();

	const label = $derived(
		$metricsStatus === 'connected'
			? 'Bike connected'
			: $metricsStatus === 'reconnecting'
				? 'Reconnecting…'
				: 'Bike disconnected'
	);

	const dotClass = $derived(
		$metricsStatus === 'connected'
			? 'bg-success'
			: $metricsStatus === 'reconnecting'
				? 'bg-warning animate-pulse'
				: 'bg-error'
	);

	const textClass = $derived(
		$metricsStatus === 'connected'
			? 'text-success'
			: $metricsStatus === 'reconnecting'
				? 'text-warning'
				: 'text-error'
	);

	const sizeClass = $derived(large ? 'w-3 h-3' : 'w-2 h-2');
</script>

<div class="flex items-center gap-1.5" title={label}>
	<span class="rounded-full {sizeClass} {dotClass}"></span>
	<span class="text-xs font-medium {textClass}">{label}</span>
</div>

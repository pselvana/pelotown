<script lang="ts">
	interface Props {
		label: string;
		value: number | string;
		unit: string;
		large?: boolean;
	}
	let { label, value, unit, large = false }: Props = $props();
</script>

<div class="metric-tile flex flex-col items-start">
	<span class="label text-xs font-semibold uppercase tracking-widest text-base-content/50"
		>{label}</span
	>
	<div class="flex items-baseline gap-1">
		<span class={large ? 'text-5xl font-bold tabular-nums text-base-content' : 'text-2xl font-bold tabular-nums text-base-content'}>{value}</span>
		<span class="text-sm font-medium text-base-content/60">{unit}</span>
	</div>
</div>

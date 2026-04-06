<script lang="ts">
	import { metrics } from '$lib/stores/metrics.js';
	import { profile } from '$lib/stores/profile.js';

	export const ZONES = [
		{ id: 1, name: 'Recovery',  min: 0,    max: 0.55, color: '#4B91F1' },
		{ id: 2, name: 'Endurance', min: 0.55, max: 0.75, color: '#52B788' },
		{ id: 3, name: 'Tempo',     min: 0.75, max: 0.90, color: '#F4A261' },
		{ id: 4, name: 'Threshold', min: 0.90, max: 1.05, color: '#E76F51' },
		{ id: 5, name: 'VO₂ Max',  min: 1.05, max: Infinity, color: '#E63946' }
	] as const;

	let pctFtp = $derived($profile.ftp > 0 ? $metrics.power / $profile.ftp : 0);
	let currentZone = $derived(
		ZONES.find((z) => pctFtp >= z.min && pctFtp < z.max) ?? ZONES[0]
	);
	let active = $derived($metrics.power > 0);
</script>

<div class="power-zone-bar flex items-center gap-3 w-full">
	<!-- Zone segments -->
	<div class="flex gap-[3px] flex-1 h-[5px] rounded-full overflow-hidden">
		{#each ZONES as zone}
			<div
				class="flex-1 h-full transition-opacity duration-300 rounded-sm"
				style="background: {zone.color}; opacity: {active && currentZone.id === zone.id ? 1 : active ? 0.2 : 0.12};"
			></div>
		{/each}
	</div>

	<!-- Zone label pill -->
	<div
		class="text-xs font-bold uppercase tracking-widest px-3 py-0.5 rounded-full transition-all duration-300 whitespace-nowrap"
		style="
			background: {active ? currentZone.color + '22' : 'transparent'};
			color: {active ? currentZone.color : 'rgba(255,255,255,0.25)'};
			border: 1px solid {active ? currentZone.color + '44' : 'rgba(255,255,255,0.08)'};
			min-width: 6.5rem;
			text-align: center;
		"
	>
		{#if active}
			Z{currentZone.id} · {currentZone.name}
		{:else}
			No signal
		{/if}
	</div>
</div>

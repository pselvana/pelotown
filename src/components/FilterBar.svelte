<script lang="ts">
	import type { Video } from '$lib/types.js';

	interface Props {
		videos: Video[];
		onFilter: (filtered: Video[]) => void;
	}
	let { videos, onFilter }: Props = $props();

	let filters = $state({ exercise: '', duration: '', type: '', instructor: '', music: '' });

	// Derive unique values for each dimension
	let exercises = $derived([...new Set(videos.map((v) => v.exercise).filter(Boolean))].sort());
	let durations = $derived(
		[...new Set(videos.map((v) => v.duration).filter(Boolean))]
			.sort((a, b) => a - b)
			.map(String)
	);
	let types = $derived([...new Set(videos.map((v) => v.type).filter(Boolean))].sort());
	let instructors = $derived(
		[...new Set(videos.map((v) => v.instructor).filter(Boolean))].sort()
	);
	let musics = $derived([...new Set(videos.map((v) => v.music).filter(Boolean))].sort());

	let isFiltered = $derived(
		Object.values(filters).some((v) => v !== '')
	);

	function applyFilters() {
		const result = videos.filter((v) => {
			if (filters.exercise && v.exercise !== filters.exercise) return false;
			if (filters.duration && String(v.duration) !== filters.duration) return false;
			if (filters.type && v.type !== filters.type) return false;
			if (filters.instructor && v.instructor !== filters.instructor) return false;
			if (filters.music && v.music !== filters.music) return false;
			return true;
		});
		onFilter(result);
	}

	function resetFilters() {
		filters = { exercise: '', duration: '', type: '', instructor: '', music: '' };
		onFilter(videos);
	}

	$effect(() => {
		// Reactive: re-apply whenever filters change
		applyFilters();
	});
</script>

<div class="filter-bar flex flex-wrap items-center gap-2 mb-4">
	<button
		class="btn btn-sm rounded-full {isFiltered ? 'btn-ghost' : 'btn-primary'}"
		onclick={resetFilters}
	>
		All Workouts
	</button>

	{#if exercises.length > 1}
		<select
			class="select select-sm rounded-full bg-base-200 border-0 max-w-[160px]"
			bind:value={filters.exercise}
		>
			<option value="">Exercise</option>
			{#each exercises as ex}
				<option value={ex}>{ex}</option>
			{/each}
		</select>
	{/if}

	{#if durations.length > 1}
		<select
			class="select select-sm rounded-full bg-base-200 border-0 max-w-[140px]"
			bind:value={filters.duration}
		>
			<option value="">Duration</option>
			{#each durations as d}
				<option value={d}>{d} min</option>
			{/each}
		</select>
	{/if}

	{#if types.length > 1}
		<select
			class="select select-sm rounded-full bg-base-200 border-0 max-w-[160px]"
			bind:value={filters.type}
		>
			<option value="">Type</option>
			{#each types as t}
				<option value={t}>{t}</option>
			{/each}
		</select>
	{/if}

	{#if instructors.length > 1}
		<select
			class="select select-sm rounded-full bg-base-200 border-0 max-w-[180px]"
			bind:value={filters.instructor}
		>
			<option value="">Instructor</option>
			{#each instructors as inst}
				<option value={inst}>{inst}</option>
			{/each}
		</select>
	{/if}

	{#if musics.length > 1}
		<select
			class="select select-sm rounded-full bg-base-200 border-0 max-w-[160px]"
			bind:value={filters.music}
		>
			<option value="">Music</option>
			{#each musics as m}
				<option value={m}>{m}</option>
			{/each}
		</select>
	{/if}
</div>

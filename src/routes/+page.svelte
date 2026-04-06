<script lang="ts">
	import type { PageData } from './$types.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Video, Folder, WorkoutSession } from '$lib/types.js';
	import LiveMetricsBar from '$components/LiveMetricsBar.svelte';
	import Breadcrumb from '$components/Breadcrumb.svelte';
	import FilterBar from '$components/FilterBar.svelte';
	import ContentGrid from '$components/ContentGrid.svelte';
	import PlayerView from '$components/PlayerView.svelte';

	let { data }: { data: PageData } = $props();

	// Active video path for fullscreen player
	let playingVideo = $state<string | null>(null);

	// FilterBar overrides; null means "show all from data"
	let filterOverride = $state<Video[] | null>(null);

	// Reset filter when page data changes (navigation)
	$effect(() => {
		data.videos; // track dependency
		filterOverride = null;
	});

	let filteredVideos = $derived(filterOverride ?? data.videos);

	function handleFolderClick(folder: Folder) {
		goto(`/?view=all&path=${encodeURIComponent(folder.path)}`);
	}

	function handleBreadcrumbNavigate(path: string) {
		goto(path ? `/?view=all&path=${encodeURIComponent(path)}` : '/?view=all');
	}

	function handleVideoPlay(video: Video) {
		playingVideo = video.path;
	}

	function handleClose() {
		playingVideo = null;
	}

	let view = $derived($page.url.searchParams.get('view') ?? 'all');
	let viewTitle = $derived(
		view === 'latest'
			? 'Recently Played'
			: view === 'popular'
				? 'Most Popular'
				: view === 'history'
					? 'Workout History'
					: 'All Workouts'
	);
	let viewDescription = $derived(
		view === 'latest'
			? 'Your most recently played workouts'
			: view === 'popular'
				? 'Your most frequently played workouts'
				: view === 'history'
					? 'All your completed workout sessions'
					: 'Browse your workout library'
	);

	function fmtDuration(secs: number): string {
		const m = Math.floor(secs / 60);
		const s = secs % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function fmtDate(unixSecs: number): string {
		return new Date(unixSecs * 1000).toLocaleDateString([], {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function fmtTime(unixSecs: number): string {
		return new Date(unixSecs * 1000).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let workouts = $derived(((data as any).workouts ?? []) as WorkoutSession[]);
</script>

<!-- Fullscreen player overlay -->
<PlayerView videoPath={playingVideo} onClose={handleClose} />

<!-- Live metrics bar -->
<LiveMetricsBar />

<!-- Hero -->
<div class="mb-6">
	<h1 class="text-3xl font-bold text-base-content">{viewTitle}</h1>
	<p class="text-base-content/50 mt-1">{viewDescription}</p>
</div>

{#if view === 'history'}
	<!-- Workout history list -->
	{#if workouts.length === 0}
		<div class="flex flex-col items-center justify-center py-24 text-base-content/30">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
			<p class="text-lg font-medium">No workouts yet</p>
			<p class="text-sm mt-1">Complete a workout session to see it here.</p>
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each workouts as w}
				<div class="rounded-2xl bg-base-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
					<!-- Date / time -->
					<div class="sm:w-36 shrink-0">
						<div class="text-sm font-semibold text-base-content">{fmtDate(w.started_at)}</div>
						<div class="text-xs text-base-content/40">{fmtTime(w.started_at)}</div>
					</div>

					<!-- Title -->
					<div class="flex-1 min-w-0">
						<div class="font-semibold text-base-content truncate">
							{w.video_title || w.video_path.split('/').pop()?.replace('.mp4', '') || 'Workout'}
						</div>
						<div class="text-xs text-base-content/40 truncate">{w.video_path}</div>
					</div>

					<!-- Stats -->
					<div class="flex gap-6 shrink-0 flex-wrap">
						<div class="text-center">
							<div class="text-xl font-bold tabular-nums text-base-content">{fmtDuration(w.duration_secs)}</div>
							<div class="text-xs text-base-content/40 uppercase tracking-wider">Duration</div>
						</div>
						<div class="text-center">
							<div class="text-xl font-bold tabular-nums text-primary">{w.total_output}</div>
							<div class="text-xs text-base-content/40 uppercase tracking-wider">kJ</div>
						</div>
						<div class="text-center">
							<div class="text-xl font-bold tabular-nums text-base-content">{Math.round(w.avg_power)}</div>
							<div class="text-xs text-base-content/40 uppercase tracking-wider">Avg W</div>
						</div>
						<div class="text-center">
							<div class="text-xl font-bold tabular-nums text-base-content">{Math.round(w.avg_cadence)}</div>
							<div class="text-xs text-base-content/40 uppercase tracking-wider">Avg RPM</div>
						</div>
						<div class="text-center">
							<div class="text-xl font-bold tabular-nums text-secondary">{w.calories}</div>
							<div class="text-xs text-base-content/40 uppercase tracking-wider">kcal</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{:else}
	<!-- Breadcrumb (only in browse mode) -->
	{#if view === 'all' && data.path}
		<Breadcrumb path={data.path} onNavigate={handleBreadcrumbNavigate} />
	{/if}

	<!-- Filter bar (only when there are videos to filter) -->
	{#if data.videos.length > 0 && view === 'all'}
		<FilterBar videos={data.videos} onFilter={(v) => (filterOverride = v)} />
	{/if}

	<!-- Content -->
	<ContentGrid
		folders={data.folders}
		videos={view === 'all' ? filteredVideos : data.videos}
		onFolderClick={handleFolderClick}
		onVideoPlay={handleVideoPlay}
	/>
{/if}

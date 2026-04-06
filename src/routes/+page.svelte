<script lang="ts">
	import type { PageData } from './$types.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Video, Folder } from '$lib/types.js';
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
		view === 'latest' ? 'Recently Played' : view === 'popular' ? 'Most Popular' : 'All Workouts'
	);
	let viewDescription = $derived(
		view === 'latest'
			? 'Your most recently played workouts'
			: view === 'popular'
				? 'Your most frequently played workouts'
				: 'Browse your workout library'
	);
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

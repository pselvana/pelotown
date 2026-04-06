<script lang="ts">
	import type { Video, Folder } from '$lib/types.js';
	import VideoCard from './VideoCard.svelte';
	import FolderCard from './FolderCard.svelte';

	interface Props {
		folders: Folder[];
		videos: Video[];
		onFolderClick: (folder: Folder) => void;
		onVideoPlay: (video: Video) => void;
	}
	let { folders, videos, onFolderClick, onVideoPlay }: Props = $props();
</script>

{#if folders.length === 0 && videos.length === 0}
	<div class="flex flex-col items-center justify-center py-24 text-base-content/40">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
		</svg>
		<p class="text-lg font-medium">No videos found</p>
		<p class="text-sm mt-1">Add .mp4 files to your videos folder</p>
	</div>
{:else}
	{#if folders.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
			{#each folders as folder (folder.path)}
				<FolderCard {folder} onClick={onFolderClick} />
			{/each}
		</div>
	{/if}

	{#if videos.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{#each videos as video (video.path)}
				<VideoCard {video} onPlay={onVideoPlay} />
			{/each}
		</div>
	{/if}
{/if}

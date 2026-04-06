<script lang="ts">
	import type { Video } from '$lib/types.js';
	import { INSTRUCTORS } from '$lib/instructors.js';
	import { formatDate } from '$lib/utils.js';

	interface Props {
		video: Video;
		onPlay: (video: Video) => void;
	}
	let { video, onPlay }: Props = $props();

	let imageUrl = $derived(INSTRUCTORS[video.instructor] ?? null);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="video-card card bg-base-200 hover:-translate-y-1 transition-transform duration-200 cursor-pointer overflow-hidden"
	ondblclick={() => onPlay(video)}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && onPlay(video)}
>
	<!-- Thumbnail -->
	<figure class="relative aspect-video bg-base-300 overflow-hidden">
		{#if imageUrl}
			<img
				src={imageUrl}
				alt={video.instructor}
				class="w-full h-full object-cover"
				loading="lazy"
			/>
		{:else}
			<div class="w-full h-full flex items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-16 h-16 text-base-content/20"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M8 5v14l11-7z" />
				</svg>
			</div>
		{/if}
		<!-- Badges -->
		<div class="absolute bottom-2 left-2 flex gap-1 flex-wrap">
			{#if video.exercise}
				<span class="badge badge-ghost badge-sm text-xs">{video.exercise}</span>
			{/if}
			{#if video.type}
				<span class="badge badge-primary badge-outline badge-sm text-xs">{video.type}</span>
			{/if}
		</div>
		<!-- Play hint -->
		<div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-base-100/40">
			<span class="text-xs text-base-content/80 font-semibold uppercase tracking-widest">Double-click to play</span>
		</div>
	</figure>

	<!-- Info -->
	<div class="card-body p-3">
		<div class="flex items-start justify-between gap-2">
			<h3 class="card-title text-sm font-semibold text-base-content leading-tight line-clamp-2">
				{video.title || video.name}
			</h3>
			{#if video.duration}
				<span class="badge badge-ghost badge-sm flex-shrink-0">{video.duration} min</span>
			{/if}
		</div>
		<div class="flex items-center justify-between mt-1">
			<span class="text-xs text-base-content/60 truncate">{video.instructor}</span>
			<span class="text-xs text-base-content/40">{video.music}</span>
		</div>
		{#if video.date}
			<span class="text-xs text-base-content/30 mt-1">{formatDate(video.date)}</span>
		{/if}
	</div>
</div>

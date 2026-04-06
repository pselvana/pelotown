<script lang="ts">
	import type { Folder } from '$lib/types.js';

	interface Props {
		folder: Folder;
		onClick: (folder: Folder) => void;
	}
	let { folder, onClick }: Props = $props();
</script>

<button
	class="folder-card card bg-base-200 hover:bg-base-300 transition-all duration-200 hover:-translate-y-1 cursor-pointer w-full text-left"
	onclick={() => onClick(folder)}
>
	<div class="card-body p-4 flex flex-row items-center gap-3">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-8 h-8 text-primary flex-shrink-0"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
			/>
		</svg>
		<span class="font-semibold text-base-content truncate">{folder.name}</span>
	</div>
</button>

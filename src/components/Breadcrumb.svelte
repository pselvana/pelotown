<script lang="ts">
	interface Props {
		path: string;
		onNavigate: (path: string) => void;
	}
	let { path, onNavigate }: Props = $props();

	let segments = $derived(path ? path.split('/').filter(Boolean) : []);
</script>

{#if segments.length > 0}
	<div class="breadcrumbs text-sm mb-4">
		<ul>
			<li>
				<button onclick={() => onNavigate('')} class="text-primary hover:underline">
					All Workouts
				</button>
			</li>
			{#each segments as segment, i}
				<li>
					{#if i < segments.length - 1}
						<button
							onclick={() => onNavigate(segments.slice(0, i + 1).join('/'))}
							class="text-primary hover:underline"
						>
							{segment}
						</button>
					{:else}
						<span class="text-base-content/60">{segment}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}

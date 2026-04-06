<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { connectMetrics } from '$lib/stores/metrics.js';
	import { browser } from '$app/environment';

	interface Props {
		children: import('svelte').Snippet;
	}
	let { children }: Props = $props();

	let view = $derived($page.url.searchParams.get('view') ?? 'all');

	onMount(() => {
		if (!browser) return;
		const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl =
			import.meta.env.PUBLIC_WS_URL ??
			(import.meta.env.DEV
				? 'ws://localhost:3001'
				: `${wsProtocol}//${window.location.host}`);
		connectMetrics(wsUrl);
	});
</script>

<div class="min-h-screen bg-base-100 text-base-content flex flex-col font-sans">
	<!-- Header -->
	<header class="sticky top-0 z-40 bg-base-100/80 backdrop-blur-xl border-b border-base-200">
		<div class="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold tracking-tight text-primary">
				Pelot<span class="text-base-content">OWN</span>
			</a>
			<nav class="flex items-center gap-1">
				<a
					href="/?view=all"
					class="btn btn-sm btn-ghost rounded-full {view === 'all' ? 'btn-primary' : ''}"
				>
					Workouts
				</a>
				<a
					href="/?view=latest"
					class="btn btn-sm btn-ghost rounded-full {view === 'latest' ? 'btn-primary' : ''}"
				>
					Latest
				</a>
				<a
					href="/?view=popular"
					class="btn btn-sm btn-ghost rounded-full {view === 'popular' ? 'btn-primary' : ''}"
				>
					Popular
				</a>
			</nav>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-8">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="py-4 px-6 text-center text-xs text-base-content/30">
		PelotOWN &copy; {new Date().getFullYear()}
	</footer>
</div>

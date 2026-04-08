<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { connectMetrics } from '$lib/stores/metrics.js';
	import { browser } from '$app/environment';
	import ProfileSettings from '../components/ProfileSettings.svelte';
	import TrophyCase from '../components/TrophyCase.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}
	let { children }: Props = $props();

	let view = $derived($page.url.searchParams.get('view') ?? 'all');
	let profileOpen = $state(false);
	let trophyOpen = $state(false);
	let currentStreak = $state(0);

	onMount(async () => {
		if (!browser) return;
		const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl =
			import.meta.env.PUBLIC_WS_URL ??
			(import.meta.env.DEV
				? 'ws://localhost:3001'
				: `${wsProtocol}//${window.location.host}`);
		connectMetrics(wsUrl);

		// Load streak count for header display
		try {
			const res = await fetch('/api/streaks');
			const data = await res.json();
			currentStreak = data.streak?.currentCount ?? 0;
		} catch {
			// non-critical
		}
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
				<a
					href="/?view=history"
					class="btn btn-sm btn-ghost rounded-full {view === 'history' ? 'btn-primary' : ''}"
				>
					History
				</a>
				<!-- Streak indicator -->
				{#if currentStreak > 0}
					<button
						class="btn btn-sm btn-ghost rounded-full ml-1 gap-1.5 font-bold tabular-nums"
						onclick={() => (trophyOpen = true)}
						title="View Trophy Case"
					>
						<span class="text-base leading-none">🔥</span>{currentStreak}
					</button>
				{/if}

				<!-- Trophy Case -->
				<button
					class="btn btn-sm btn-ghost btn-circle ml-1"
					onclick={() => (trophyOpen = true)}
					title="Trophy Case"
					aria-label="Trophy Case"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
						<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
						<path d="M4 22h16"/>
						<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
						<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
						<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
					</svg>
				</button>

				<!-- Profile Settings -->
				<button
					class="btn btn-sm btn-ghost btn-circle ml-1"
					onclick={() => (profileOpen = true)}
					title="Profile Settings"
					aria-label="Profile Settings"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="8" r="4" />
						<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
					</svg>
				</button>
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

{#if profileOpen}
	<ProfileSettings onclose={() => (profileOpen = false)} />
{/if}

{#if trophyOpen}
	<TrophyCase onclose={() => (trophyOpen = false)} />
{/if}

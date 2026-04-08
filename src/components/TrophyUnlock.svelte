<script lang="ts">
	import { onMount } from 'svelte';
	import type { AchievementDef } from '$lib/types.js';

	interface Props {
		achievement: AchievementDef;
		onDismiss: () => void;
	}
	let { achievement, onDismiss }: Props = $props();

	const TIER_STYLES: Record<string, string> = {
		bronze:   'from-amber-900/80 to-amber-700/60 border-amber-500/50 text-amber-300',
		silver:   'from-zinc-800/80 to-zinc-600/60 border-zinc-400/50 text-zinc-200',
		gold:     'from-yellow-900/80 to-yellow-700/60 border-yellow-400/50 text-yellow-300',
		platinum: 'from-indigo-900/80 to-cyan-900/60 border-cyan-400/50 text-cyan-200',
	};

	const TIER_BADGE: Record<string, string> = {
		bronze:   'bg-amber-700 text-amber-100',
		silver:   'bg-zinc-500 text-zinc-100',
		gold:     'bg-yellow-600 text-yellow-100',
		platinum: 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white',
	};

	let visible = $state(false);

	onMount(() => {
		// Trigger enter animation
		requestAnimationFrame(() => { visible = true; });

		// Auto-dismiss after 4s
		const t = setTimeout(onDismiss, 4000);
		return () => clearTimeout(t);
	});
</script>

<!-- Confetti dots -->
{#if visible}
	<div class="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
		{#each Array(18) as _, i}
			<div
				class="confetti-dot"
				style="
					left: {20 + Math.sin(i * 1.3) * 30 + (i % 5) * 12}%;
					animation-delay: {i * 0.07}s;
					background: {['#97a9ff','#ff716c','#fbbf24','#34d399','#a78bfa'][i % 5]};
				"
			></div>
		{/each}
	</div>
{/if}

<button
	class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[71] w-full max-w-sm px-4
		   transition-all duration-500 ease-out
		   {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
	onclick={onDismiss}
	aria-label="Dismiss achievement"
>
	<div class="rounded-2xl border bg-gradient-to-br {TIER_STYLES[achievement.tier]}
				backdrop-blur-xl shadow-2xl p-5 flex items-center gap-4">
		<!-- Icon -->
		<div class="text-5xl leading-none select-none">{achievement.icon}</div>

		<!-- Text -->
		<div class="flex-1 text-left">
			<div class="text-xs font-bold uppercase tracking-widest opacity-60 mb-0.5">
				Achievement Unlocked
			</div>
			<div class="text-lg font-bold leading-tight">{achievement.name}</div>
			<div class="text-xs opacity-70 mt-0.5">{achievement.description}</div>
		</div>

		<!-- Tier badge -->
		<span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide {TIER_BADGE[achievement.tier]}">
			{achievement.tier}
		</span>
	</div>
</button>

<style>
	.confetti-dot {
		position: absolute;
		top: -8px;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		animation: confetti-fall 1.8s ease-in forwards;
	}

	@keyframes confetti-fall {
		0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
		100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
	}
</style>

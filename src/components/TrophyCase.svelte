<script lang="ts">
	import { onMount } from 'svelte';
	import type { AchievementState, CalendarDay, StreakState, PRRecord } from '$lib/types.js';

	interface Props {
		onclose: () => void;
	}
	let { onclose }: Props = $props();

	let achievements = $state<AchievementState[]>([]);
	let prs = $state<PRRecord[]>([]);
	let streak = $state<StreakState | null>(null);
	let calendar = $state<CalendarDay[]>([]);
	let loading = $state(true);
	let activeTab = $state<'milestone' | 'streak'>('milestone');

	onMount(async () => {
		const [trophyRes, streakRes] = await Promise.all([
			fetch('/api/trophies'),
			fetch('/api/streaks'),
		]);
		const trophyData = await trophyRes.json();
		const streakData = await streakRes.json();
		achievements = trophyData.achievements;
		prs = trophyData.prs;
		streak = streakData.streak;
		calendar = streakData.calendar;
		loading = false;
	});

	let filtered = $derived(achievements.filter(a => a.type === activeTab));

	let unlocked = $derived(
		filtered
			.filter(a => a.unlockedAt !== null)
			.sort((a, b) => b.unlockedAt! - a.unlockedAt!)
	);
	let locked = $derived(
		filtered
			.filter(a => a.unlockedAt === null)
			.sort((a, b) => a.threshold - b.threshold)
	);

	// Build 7-row × N-col heatmap grid from flat calendar array (oldest first)
	let calendarWeeks = $derived.by<(CalendarDay | null)[][]>(() => {
		if (!calendar.length) return [];
		const firstDate = new Date(calendar[0].date + 'T00:00:00');
		const firstDow = (firstDate.getDay() + 6) % 7; // 0=Mon, 6=Sun
		const cells: (CalendarDay | null)[] = [
			...Array<null>(firstDow).fill(null),
			...calendar,
		];
		const weeks: (CalendarDay | null)[][] = [];
		for (let i = 0; i < cells.length; i += 7) {
			weeks.push(cells.slice(i, i + 7));
		}
		return weeks;
	});

	let monthLabels = $derived.by<{ label: string; col: number }[]>(() => {
		if (!calendar.length) return [];
		const firstDow = (new Date(calendar[0].date + 'T00:00:00').getDay() + 6) % 7;
		const seen = new Set<string>();
		const labels: { label: string; col: number }[] = [];
		calendar.forEach((day, i) => {
			const monthKey = day.date.slice(0, 7);
			if (!seen.has(monthKey)) {
				seen.add(monthKey);
				const col = Math.floor((i + firstDow) / 7);
				const label = new Date(day.date + 'T00:00:00').toLocaleString('default', { month: 'short' });
				labels.push({ label, col });
			}
		});
		return labels;
	});

	const TIER_BADGE: Record<string, string> = {
		bronze:   'bg-amber-700/80 text-amber-200',
		silver:   'bg-zinc-600/80 text-zinc-200',
		gold:     'bg-yellow-600/80 text-yellow-100',
		platinum: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white',
	};

	const TIER_RING: Record<string, string> = {
		bronze:   'ring-amber-500/40',
		silver:   'ring-zinc-400/40',
		gold:     'ring-yellow-400/50',
		platinum: 'ring-cyan-400/50',
	};

	const PR_META: Record<string, { label: string; unit: string }> = {
		max_power:     { label: 'Peak Power',   unit: 'W' },
		total_output:  { label: 'Best Output',  unit: 'kJ' },
		duration_secs: { label: 'Longest Ride', unit: '' },
	};

	function fmtDate(ms: number): string {
		return new Date(ms).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function fmtPR(metric: string, value: number): string {
		if (metric === 'duration_secs') {
			const m = Math.floor(value / 60);
			const s = Math.round(value % 60);
			return `${m}:${String(s).padStart(2, '0')}`;
		}
		if (metric === 'total_output') return value.toFixed(1);
		return Math.round(value).toString();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4"
	role="dialog"
	aria-modal="true"
	aria-label="Trophy Case"
>
	<div
		class="absolute inset-0 bg-black/60 backdrop-blur-sm"
		onclick={onclose}
		role="presentation"
	></div>

	<div class="relative bg-base-200 rounded-3xl w-full max-w-2xl shadow-2xl border border-base-content/10 flex flex-col max-h-[90vh]">

		<!-- Header -->
		<div class="sticky top-0 z-10 bg-base-200/90 backdrop-blur-xl rounded-t-3xl px-6 py-4 flex items-center justify-between border-b border-base-content/10">
			<h2 class="text-xl font-bold tracking-tight">🏆 Trophy Case</h2>
			<button class="btn btn-sm btn-ghost btn-circle" onclick={onclose} aria-label="Close">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6 6 18M6 6l12 12"/>
				</svg>
			</button>
		</div>

		<div class="overflow-y-auto flex-1 min-h-0">
		{#if loading}
			<div class="flex items-center justify-center py-24 text-base-content/40">Loading...</div>
		{:else}
			<!-- Streak stats -->
			<div class="px-6 pt-5 pb-2">
				<div class="flex gap-3 mb-5">
					<div class="flex-1 rounded-2xl bg-base-300 px-5 py-4 text-center">
						<div class="text-4xl font-bold tabular-nums text-primary">{streak?.currentCount ?? 0}</div>
						<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">🔥 Current Streak</div>
					</div>
					<div class="flex-1 rounded-2xl bg-base-300 px-5 py-4 text-center">
						<div class="text-4xl font-bold tabular-nums text-secondary">{streak?.longestCount ?? 0}</div>
						<div class="text-xs font-semibold uppercase tracking-widest text-base-content/50 mt-1">⚡ Longest Streak</div>
					</div>
				</div>

				<!-- Calendar heatmap -->
				<div class="rounded-2xl bg-base-300 px-4 pt-3 pb-4 overflow-x-auto">
					<div class="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-3">Activity — Last 12 Weeks</div>

					{#if calendarWeeks.length}
						<!-- Month labels row -->
						<div class="flex gap-1 mb-1 pl-5">
							{#each calendarWeeks as _, colIdx}
								{@const lbl = monthLabels.find(m => m.col === colIdx)}
								<div class="w-3 shrink-0 text-[10px] text-base-content/40 overflow-visible whitespace-nowrap">
									{lbl?.label ?? ''}
								</div>
							{/each}
						</div>

						<div class="flex gap-1">
							<!-- Day-of-week labels -->
							<div class="flex flex-col gap-1 mr-1">
								{#each ['M','','W','','F','','S'] as dow}
									<div class="h-3 w-3 text-[10px] text-base-content/30 leading-3 text-right">{dow}</div>
								{/each}
							</div>

							<!-- Week columns -->
							{#each calendarWeeks as week}
								<div class="flex flex-col gap-1">
									{#each week as day}
										{#if day}
											<div
												title="{day.date}{day.hasWorkout ? ' · Workout' : ''}{day.achievementIds.length ? ' · 🏆 Achievement unlocked!' : ''}"
												class="w-3 h-3 rounded-sm shrink-0 cursor-default
													   {day.achievementIds.length
														   ? 'bg-yellow-400 ring-1 ring-yellow-300/60'
														   : day.hasWorkout
														   ? 'bg-primary'
														   : 'bg-base-content/10'}"
											></div>
										{:else}
											<div class="w-3 h-3 shrink-0"></div>
										{/if}
									{/each}
								</div>
							{/each}
						</div>

						<div class="flex items-center gap-4 mt-3 text-[10px] text-base-content/40">
							<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-base-content/10 inline-block"></span>Rest</span>
							<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary inline-block"></span>Workout</span>
							<span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-yellow-400 inline-block"></span>Achievement</span>
						</div>
					{:else}
						<div class="text-center py-4 text-sm text-base-content/30">No activity yet — complete a workout to start tracking!</div>
					{/if}
				</div>
			</div>

			<!-- Personal Records -->
			{#if prs.length > 0}
				<div class="px-6 pt-4">
					<div class="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-3">Personal Records</div>
					<div class="grid grid-cols-3 gap-3">
						{#each prs as pr}
							{@const meta = PR_META[pr.metric]}
							<div class="rounded-2xl bg-base-300 p-3 text-center">
								<div class="text-2xl font-bold tabular-nums text-base-content">
									{fmtPR(pr.metric, pr.bestValue)}{#if meta?.unit}<span class="text-sm ml-0.5 font-normal text-base-content/60">{meta.unit}</span>{/if}
								</div>
								<div class="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 mt-0.5">{meta?.label ?? pr.metric}</div>
								<div class="text-[10px] text-base-content/30 mt-0.5">{fmtDate(pr.setAt)}</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Achievement Tabs + Grid -->
			<div class="px-6 pt-5 pb-6">
				<div class="flex gap-2 mb-4">
					<button
						class="btn btn-sm rounded-full {activeTab === 'milestone' ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => (activeTab = 'milestone')}
					>
						Milestones
					</button>
					<button
						class="btn btn-sm rounded-full {activeTab === 'streak' ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => (activeTab = 'streak')}
					>
						Streaks
					</button>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
					<!-- Unlocked trophies -->
					{#each unlocked as ach}
						<div class="rounded-2xl bg-base-300 p-4 flex flex-col gap-2 ring-1 {TIER_RING[ach.tier]}">
							<div class="text-3xl leading-none">{ach.icon}</div>
							<div class="font-bold text-sm leading-tight">{ach.name}</div>
							<div class="text-xs text-base-content/50 leading-snug">{ach.description}</div>
							<div class="flex items-center justify-between mt-auto pt-1">
								<span class="text-[10px] text-base-content/30">{fmtDate(ach.unlockedAt!)}</span>
								<span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide {TIER_BADGE[ach.tier]}">
									{ach.tier}
								</span>
							</div>
						</div>
					{/each}

					<!-- Locked trophies -->
					{#each locked as ach}
						{@const pct = Math.min(100, Math.round((ach.progress / ach.threshold) * 100))}
						{@const remaining = ach.threshold - ach.progress}
						<div class="rounded-2xl bg-base-300/50 p-4 flex flex-col gap-2 opacity-55">
							<div class="text-3xl leading-none grayscale">{ach.icon}</div>
							<div class="font-bold text-sm leading-tight text-base-content/60">{ach.name}</div>
							<div class="text-xs text-base-content/40 leading-snug">{ach.description}</div>
							<div class="mt-auto pt-1">
								<div class="flex justify-between text-[10px] text-base-content/40 mb-1">
									<span>{ach.progress.toLocaleString()} / {ach.threshold.toLocaleString()}</span>
									<span>{remaining.toLocaleString()} to go</span>
								</div>
								<div class="h-1.5 rounded-full bg-base-content/10 overflow-hidden">
									<div class="h-full rounded-full bg-base-content/30" style="width: {pct}%"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if filtered.length === 0}
					<div class="text-center text-base-content/30 py-8 text-sm">No achievements yet — keep going!</div>
				{/if}
			</div>
		{/if}
	</div>
	</div>
</div>

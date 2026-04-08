import { getDb } from './db.js';

export type AchievementType = 'milestone' | 'streak';
export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface AchievementDef {
	id: string;
	type: AchievementType;
	name: string;
	description: string;
	threshold: number;
	tier: Tier;
	icon: string;
}

export interface AchievementState extends AchievementDef {
	unlockedAt: number | null; // unix ms, null if locked
	progress: number;          // current value toward threshold
}

export const ACHIEVEMENTS: AchievementDef[] = [
	// Milestone achievements (total workout count)
	{ id: 'milestone_1',    type: 'milestone', name: 'First Ride',       description: 'Complete your first workout',   threshold: 1,    tier: 'bronze',   icon: '🚀' },
	{ id: 'milestone_10',   type: 'milestone', name: 'Ten Strong',       description: 'Complete 10 workouts',          threshold: 10,   tier: 'bronze',   icon: '🎯' },
	{ id: 'milestone_25',   type: 'milestone', name: 'Quarter Century',  description: 'Complete 25 workouts',          threshold: 25,   tier: 'silver',   icon: '🌟' },
	{ id: 'milestone_50',   type: 'milestone', name: 'Half Century',     description: 'Complete 50 workouts',          threshold: 50,   tier: 'silver',   icon: '💫' },
	{ id: 'milestone_100',  type: 'milestone', name: 'Century Rider',    description: 'Complete 100 workouts',         threshold: 100,  tier: 'gold',     icon: '🏆' },
	{ id: 'milestone_200',  type: 'milestone', name: 'Double Century',   description: 'Complete 200 workouts',         threshold: 200,  tier: 'gold',     icon: '👑' },
	{ id: 'milestone_250',  type: 'milestone', name: '250 Club',         description: 'Complete 250 workouts',         threshold: 250,  tier: 'platinum', icon: '💎' },
	{ id: 'milestone_300',  type: 'milestone', name: '300 Strong',       description: 'Complete 300 workouts',         threshold: 300,  tier: 'platinum', icon: '💎' },
	{ id: 'milestone_400',  type: 'milestone', name: '400 Elite',        description: 'Complete 400 workouts',         threshold: 400,  tier: 'platinum', icon: '💎' },
	{ id: 'milestone_500',  type: 'milestone', name: 'Half Thousand',    description: 'Complete 500 workouts',         threshold: 500,  tier: 'platinum', icon: '🌋' },
	{ id: 'milestone_750',  type: 'milestone', name: '750 Legend',       description: 'Complete 750 workouts',         threshold: 750,  tier: 'platinum', icon: '🌋' },
	{ id: 'milestone_1000', type: 'milestone', name: 'Millennium Rider', description: 'Complete 1000 workouts',        threshold: 1000, tier: 'platinum', icon: '⚡' },

	// Streak achievements (consecutive days)
	{ id: 'streak_3',   type: 'streak', name: 'Hat Trick',          description: 'Work out 3 days in a row',   threshold: 3,   tier: 'bronze',   icon: '🔥' },
	{ id: 'streak_7',   type: 'streak', name: 'Week Warrior',       description: 'Work out 7 days in a row',   threshold: 7,   tier: 'bronze',   icon: '🔥' },
	{ id: 'streak_14',  type: 'streak', name: 'Two Weeks Strong',   description: 'Work out 14 days in a row',  threshold: 14,  tier: 'silver',   icon: '⚡' },
	{ id: 'streak_30',  type: 'streak', name: 'Monthly Grind',      description: 'Work out 30 days in a row',  threshold: 30,  tier: 'gold',     icon: '💪' },
	{ id: 'streak_100', type: 'streak', name: 'Century Streak',     description: 'Work out 100 days in a row', threshold: 100, tier: 'platinum', icon: '🌋' },
];

export const ACHIEVEMENT_MAP = new Map<string, AchievementDef>(
	ACHIEVEMENTS.map(a => [a.id, a])
);

/**
 * Check which achievements are newly unlocked after a workout.
 * Returns full AchievementDef objects for any newly unlocked achievements.
 */
export function evaluateAchievements(
	totalWorkouts: number,
	longestStreak: number,
): AchievementDef[] {
	const db = getDb();
	const now = Math.floor(Date.now() / 1000);

	const unlocked = new Set(
		(db.prepare(`SELECT achievement_id FROM achievement_unlocks`).all() as { achievement_id: string }[])
			.map(r => r.achievement_id)
	);

	const insertUnlock = db.prepare(
		`INSERT OR IGNORE INTO achievement_unlocks (achievement_id, unlocked_at) VALUES (?, ?)`
	);

	const newlyUnlocked: AchievementDef[] = [];

	for (const ach of ACHIEVEMENTS) {
		if (unlocked.has(ach.id)) continue;

		const qualified =
			(ach.type === 'milestone' && totalWorkouts >= ach.threshold) ||
			(ach.type === 'streak' && longestStreak >= ach.threshold);

		if (qualified) {
			insertUnlock.run(ach.id, now);
			newlyUnlocked.push(ach);
		}
	}

	return newlyUnlocked;
}

/** Get all achievements with current progress and unlock state. */
export function getAchievementStates(): AchievementState[] {
	const db = getDb();

	const { count: totalWorkouts } = db
		.prepare(`SELECT COUNT(*) as count FROM workout_sessions`)
		.get() as { count: number };

	const streakRow = db
		.prepare(`SELECT longest_count FROM streak_state WHERE id = 1`)
		.get() as { longest_count: number } | undefined;
	const longestStreak = streakRow?.longest_count ?? 0;

	const unlockMap = new Map<string, number>();
	(db
		.prepare(`SELECT achievement_id, unlocked_at FROM achievement_unlocks`)
		.all() as { achievement_id: string; unlocked_at: number }[])
		.forEach(r => unlockMap.set(r.achievement_id, r.unlocked_at));

	return ACHIEVEMENTS.map(ach => ({
		...ach,
		unlockedAt: unlockMap.has(ach.id) ? unlockMap.get(ach.id)! * 1000 : null,
		progress: ach.type === 'milestone' ? totalWorkouts : longestStreak,
	}));
}

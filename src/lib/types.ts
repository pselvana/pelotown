export interface Video {
	id?: number;
	name: string;
	path: string;
	exercise: string;
	date: string; // YYYYMMDD
	duration: number; // minutes
	instructor: string;
	type: string;
	music: string;
	title: string;
	file_size?: number;
	play_count?: number;
}

export interface Folder {
	name: string;
	path: string;
}

export interface BrowseResult {
	folders: Folder[];
	videos: Video[];
}

export interface Metrics {
	cadence: number;
	resistance: number;
	speed: number;
	power: number;
}

export interface WorkoutSample {
	t: number; // unix ms
	cadence: number;
	resistance: number;
	speed: number;
	power: number;
}

export interface WorkoutSummary {
	startedAt: number; // unix ms
	endedAt: number; // unix ms
	durationSecs: number;
	samples: WorkoutSample[];
	avgCadence: number;
	maxCadence: number;
	avgResistance: number;
	maxResistance: number;
	avgPower: number;
	maxPower: number;
	avgSpeed: number;
	totalOutput: number; // kJ
	calories: number;
}

export interface WorkoutSession {
	id: number;
	video_path: string;
	video_title: string;
	started_at: number; // unix seconds
	ended_at: number; // unix seconds
	duration_secs: number;
	avg_cadence: number;
	max_cadence: number;
	avg_resistance: number;
	max_resistance: number;
	avg_power: number;
	max_power: number;
	avg_speed: number;
	total_output: number; // kJ
	calories: number;
}

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

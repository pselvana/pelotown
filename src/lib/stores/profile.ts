import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type BikeModel = 'bike' | 'bike_plus';
export type SpeedUnit = 'kmh' | 'mph';

export interface Profile {
	bikeModel: BikeModel;
	ftp: number;
	speedUnit: SpeedUnit;
}

const DEFAULTS: Profile = { bikeModel: 'bike', ftp: 200, speedUnit: 'kmh' };

function getCookie(name: string): string | undefined {
	if (!browser) return undefined;
	const match = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
	return match ? decodeURIComponent(match.split('=')[1]) : undefined;
}

function setCookie(name: string, value: string): void {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365 * 10}`;
}

function loadProfile(): Profile {
	return {
		bikeModel: (getCookie('bikeModel') as BikeModel) ?? DEFAULTS.bikeModel,
		ftp: parseInt(getCookie('ftp') ?? '') || DEFAULTS.ftp,
		speedUnit: (getCookie('speedUnit') as SpeedUnit) ?? DEFAULTS.speedUnit
	};
}

export const profile = writable<Profile>(loadProfile());

if (browser) {
	profile.subscribe((p) => {
		setCookie('bikeModel', p.bikeModel);
		setCookie('ftp', String(p.ftp));
		setCookie('speedUnit', p.speedUnit);
	});
}

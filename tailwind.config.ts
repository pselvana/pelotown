import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Lexend', 'sans-serif']
			}
		}
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				pelotown: {
					primary: '#97a9ff',
					'primary-content': '#1a1e2a',
					secondary: '#ff716c',
					'secondary-content': '#1a1e2a',
					accent: '#ffa3e9',
					'accent-content': '#1a1e2a',
					neutral: '#1a1e2a',
					'neutral-content': '#e0e4f0',
					'base-100': '#0b0e14',
					'base-200': '#141821',
					'base-300': '#1a1e2a',
					'base-content': '#e0e4f0',
					info: '#97a9ff',
					success: '#6ee7b7',
					warning: '#fbbf24',
					error: '#ff716c'
				}
			}
		],
		darkTheme: 'pelotown',
		base: true,
		styled: true,
		utils: true,
		logs: false
	}
} satisfies Config;

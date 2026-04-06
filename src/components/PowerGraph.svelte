<script lang="ts">
	import type { WorkoutSample } from '$lib/types.js';

	interface Props {
		samples: WorkoutSample[];
	}
	let { samples }: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);

	$effect(() => {
		if (!canvas) return;
		drawGraph(canvas, samples);
	});

	function drawGraph(c: HTMLCanvasElement, data: WorkoutSample[]) {
		const ctx = c.getContext('2d');
		if (!ctx) return;

		const W = c.width;
		const H = c.height;
		ctx.clearRect(0, 0, W, H);

		if (data.length < 2) return;

		const powers = data.map((s) => s.power);
		const maxP = Math.max(...powers, 1);
		const pad = 4;
		const drawH = H - pad * 2;

		// Area fill
		const gradient = ctx.createLinearGradient(0, pad, 0, H);
		gradient.addColorStop(0, 'rgba(151,169,255,0.35)');
		gradient.addColorStop(1, 'rgba(151,169,255,0.02)');

		ctx.beginPath();
		data.forEach((s, i) => {
			const x = (i / (data.length - 1)) * W;
			const y = pad + drawH - (s.power / maxP) * drawH;
			if (i === 0) {
				ctx.moveTo(x, H);
				ctx.lineTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		});
		ctx.lineTo(W, H);
		ctx.closePath();
		ctx.fillStyle = gradient;
		ctx.fill();

		// Line
		ctx.beginPath();
		data.forEach((s, i) => {
			const x = (i / (data.length - 1)) * W;
			const y = pad + drawH - (s.power / maxP) * drawH;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		});
		ctx.strokeStyle = '#97a9ff';
		ctx.lineWidth = 2;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.stroke();
	}
</script>

<div class="power-graph w-full" style="height:56px;">
	<canvas bind:this={canvas} width="1000" height="56" class="w-full h-full" style="display:block;"></canvas>
</div>

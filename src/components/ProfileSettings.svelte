<script lang="ts">
	import { profile, type BikeModel, type SpeedUnit } from '$lib/stores/profile.js';

	interface Props {
		onclose: () => void;
	}
	let { onclose }: Props = $props();

	let bikeModel = $state($profile.bikeModel);
	let ftp = $state<number | null>($profile.ftp);
	let ftpInput = $state($profile.ftp !== null ? String($profile.ftp) : '');
	let speedUnit = $state($profile.speedUnit);

	function save() {
		const parsed = parseInt(ftpInput);
		ftp = Number.isFinite(parsed) && parsed >= 50 ? Math.min(500, parsed) : null;
		profile.set({
			bikeModel: bikeModel as BikeModel,
			ftp,
			speedUnit: speedUnit as SpeedUnit
		});
		onclose();
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onclose()} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-base-100/60 backdrop-blur-xl"
	role="dialog"
	aria-modal="true"
	aria-label="Profile Settings"
>
	<div class="card w-full max-w-md bg-base-200 shadow-2xl border border-base-content/10 mx-4">
		<div class="card-body gap-6">
			<div class="flex items-center justify-between">
				<h2 class="card-title text-lg">Profile Settings</h2>
				<button class="btn btn-ghost btn-sm btn-circle" onclick={onclose} aria-label="Close">✕</button>
			</div>

			<!-- Bike model -->
			<div class="form-control gap-3">
				<span class="label-text font-semibold uppercase tracking-widest text-xs text-base-content/50">
					Peloton Bike Model
				</span>
				<div class="flex gap-3">
					<label class="flex-1 cursor-pointer">
						<input type="radio" class="hidden" name="bikeModel" value="bike" bind:group={bikeModel} />
						<div class="btn btn-sm w-full {bikeModel === 'bike' ? 'btn-primary' : 'btn-ghost border border-base-content/20'}">
							Bike
						</div>
					</label>
					<label class="flex-1 cursor-pointer">
						<input type="radio" class="hidden" name="bikeModel" value="bike_plus" bind:group={bikeModel} />
						<div class="btn btn-sm w-full {bikeModel === 'bike_plus' ? 'btn-primary' : 'btn-ghost border border-base-content/20'}">
							Bike+
						</div>
					</label>
				</div>
				<p class="text-xs text-base-content/40">
					Calibrates power output — Bike: ×2.0, Bike+: ×3.0
				</p>
			</div>

			<!-- Speed unit -->
			<div class="form-control gap-3">
				<span class="label-text font-semibold uppercase tracking-widest text-xs text-base-content/50">
					Speed Unit
				</span>
				<div class="flex gap-3">
					<label class="flex-1 cursor-pointer">
						<input type="radio" class="hidden" name="speedUnit" value="kmh" bind:group={speedUnit} />
						<div class="btn btn-sm w-full {speedUnit === 'kmh' ? 'btn-primary' : 'btn-ghost border border-base-content/20'}">
							km/h
						</div>
					</label>
					<label class="flex-1 cursor-pointer">
						<input type="radio" class="hidden" name="speedUnit" value="mph" bind:group={speedUnit} />
						<div class="btn btn-sm w-full {speedUnit === 'mph' ? 'btn-primary' : 'btn-ghost border border-base-content/20'}">
							mph
						</div>
					</label>
				</div>
			</div>

			<!-- FTP -->
			<div class="form-control gap-2">
				<label class="label-text font-semibold uppercase tracking-widest text-xs text-base-content/50" for="ftp-input">
					FTP — Functional Threshold Power
				</label>
				<div class="flex items-center gap-3">
					<input
						id="ftp-input"
						type="number"
						class="input input-bordered flex-1"
						bind:value={ftpInput}
						min="50"
						max="500"
						placeholder="Not set"
					/>
					<span class="text-sm font-medium text-base-content/60">W</span>
					{#if ftpInput}
						<button
							type="button"
							class="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content"
							onclick={() => (ftpInput = '')}
							aria-label="Clear FTP"
						>✕</button>
					{/if}
				</div>
				<p class="text-xs text-base-content/40">
					Max sustainable power for ~60 min. Used to show training zones.
				</p>
			</div>

			<div class="card-actions justify-end pt-2">
				<button class="btn btn-ghost btn-sm" onclick={onclose}>Cancel</button>
				<button class="btn btn-primary btn-sm" onclick={save}>Save</button>
			</div>
		</div>
	</div>
</div>

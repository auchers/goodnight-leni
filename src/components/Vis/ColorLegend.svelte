<script lang="ts">
	import { selectedThreshold } from '$src/store';
	import { COLOR_SCALE } from '$src/utils/constants';

	const thresholds = [0, ...COLOR_SCALE.thresholds()];
	const setThreshold = (i: number) =>
		selectedThreshold.set([thresholds[i], thresholds[i + 1] || Infinity]);
</script>

<div class="color-legend">
	<div class="thresholds" class:hasActiveThresh={$selectedThreshold}>
		{#each thresholds as threshold, i}
			<div
				class="threshold"
				on:mouseenter={() => setThreshold(i)}
				on:mouseleave={() => selectedThreshold.set(null)}
			>
				<div
					class="threshold-swatch"
					class:active={$selectedThreshold && $selectedThreshold[0] === threshold}
					style="background-color: {COLOR_SCALE(threshold)};"
				/>
				<div class="threshold-value">{threshold}</div>
			</div>
		{/each}
	</div>
	<div class="legend-title"># of hours slept</div>
</div>

<style lang="scss">
	.color-legend {
		font-family: Roboto, sans-serif;
		position: absolute;
		bottom: 0;
		left: 0.5em;

		.thresholds {
			display: flex;

			&.hasActiveThresh {
				.threshold-swatch:not(.active) {
					opacity: 0.5;
				}
			}

			.threshold {
				display: grid;

				.threshold-swatch {
					width: 2.5em;
					height: 1em;
					border-radius: 5px;
					margin-right: 0.25em;
					cursor: pointer;
				}

				.threshold-value {
					transform: translateX(-0.25em);
				}
			}
		}

		.legend-title {
			text-align: center;
		}
	}
</style>

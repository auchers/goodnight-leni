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
				<div class="threshold-value">{threshold}</div>
				<div
					class="threshold-swatch"
					class:active={$selectedThreshold && $selectedThreshold[0] === threshold}
					style="background-color: {COLOR_SCALE(threshold)};"
				/>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.color-legend {
		width: max-content;
		font-family: 'Roboto Condensed', sans-serif;
		font-weight: 100;
		bottom: 0;
		left: 0.5em;
		padding-left: 5px;

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
					width: 30px;
					height: 17px;
					// border-radius: 5px;
					margin-right: 0.25em;
				}

				.threshold-value {
					transform: translateX(-0.25em);
				}
			}
		}
	}

	@media (max-width: 768px) {
		.color-legend {
			.thresholds {
				.threshold {
					font-size: 0.9em;
					.threshold-swatch {
						width: 1.5em;
						height: 0.9em;
					}
				}
			}
		}
	}
</style>

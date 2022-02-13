<script lang="ts">
	import type { SleepLog } from '$src/data/types';
	import { COLOR_SCALE, FORMATTERS } from '$src/utils/constants';
	import type { ScaleLinear, ScaleQuantize } from 'd3';
	import Color from 'color';

	export let tooltipPos: [number, number] | [null, null];
	export let hoveredLog: SleepLog | null;
	export let lengthScale: ScaleLinear<any, any>;
	export let needsFlip: boolean;

	$: [x, y] = tooltipPos;

	const scale = lengthScale.copy().range([10, 350]);
	$: dur = hoveredLog && hoveredLog.timeToEnd - hoveredLog.timeToStart;
</script>

<div
	class="tooltip"
	class:visible={x && y}
	class:needsFlip
	style="transform:translate({x}px,{y}px) translateY(-50%) {needsFlip
		? `translateX(calc(-100% - 2em))`
		: ''};"
>
	{#if hoveredLog}
		<div class="tooltip-title">{FORMATTERS.dateLabel(hoveredLog.Start)}</div>
		<div class="tooltip-chart">
			<div
				class="tooltip-bar"
				class:isLight={Color(COLOR_SCALE(dur)).isLight()}
				style="width: {scale(hoveredLog.timeToEnd) - scale(hoveredLog.timeToStart)}px;
				background-color:{COLOR_SCALE(dur)}"
			/>
			<div class="tooltip-duration">{FORMATTERS.hour(dur)} hours</div>
			<div class="row">
				<div class="tooltip-time start">{FORMATTERS.time(hoveredLog.Start)}</div>
				<div class="tooltip-time end">{FORMATTERS.time(hoveredLog.End)}</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.tooltip {
		--tooltip-background-color: #eee;
		position: absolute;
		transition: transform 50ms, opacity 100ms;
		min-width: 10em;
		min-height: 10px;
		background: var(--tooltip-background-color);
		color: var(--background-color);
		pointer-events: none;
		margin: 1em;
		padding: 0.5em;
		border-radius: 5px;
		box-shadow: var(--shadow-elevation-medium);
		font-family: 'Roboto Condensed', sans-serif;

		&:not(.visible) {
			opacity: 0;
		}

		&::after {
			content: '';
			position: absolute;
			border: 10px solid #000;
			left: 0;
			top: 50%;
			transform: translate(-100%, -50%);
			border-color: transparent var(--tooltip-background-color) transparent transparent;
		}

		&.needsFlip::after {
			left: 100%;
			transform: translate(0, -50%);
			border-color: transparent transparent transparent var(--tooltip-background-color);
		}
		.tooltip-title {
			font-weight: 500;
			font-variant: all-small-caps;
			font-size: 1.25em;
		}

		.tooltip-chart {
			display: grid;
			grid-template-columns: max-content 1fr;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.row {
				display: flex;
				justify-content: space-between;

				.tooltip-time {
					font-size: 0.75em;
					opacity: 0.7;

					&.end {
						margin-left: 0.5em;
					}
				}
			}

			.tooltip-duration {
				font-size: 0.9em;
				text-align: end;
			}

			.tooltip-bar {
				height: 0.65em;
				// border-radius: 1em;
				margin-right: 0.75em;
				position: relative;

				&.isLight {
					border: 1px solid var(--text-color-grey);
				}

				&::before,
				&::after {
					content: '';
					height: 0.76em;
					width: 1px;
					border-left: 1px grey solid;
					position: absolute;
					left: -1px; // adjust for border stroke
					transform: translateY(-25%);
				}

				&::after {
					left: 100%;
				}
			}
		}
	}
</style>

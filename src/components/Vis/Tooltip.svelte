<script lang="ts">
	import type { SleepLog } from '$src/data/types';
	import { FORMATTERS } from '$src/utils/constants';
	import type { ScaleLinear, ScaleQuantize } from 'd3';

	export let tooltipPos: [number, number] | [null, null];
	export let hoveredLog: SleepLog | null;
	export let lengthScale: ScaleLinear<any, any>;
	export let colorScale: ScaleQuantize<any, any>;
	export let needsFlip: boolean;

	$: [x, y] = tooltipPos;

	const scale = lengthScale.copy().range([10, 350]);
	$: dur = hoveredLog && hoveredLog.timeToEnd - hoveredLog.timeToStart;
</script>

<div
	class="tooltip"
	class:visible={x && y}
	class:needsFlip
	style="transform:translate({x}px,{y}px) {needsFlip ? `translateX(calc(-100% - 2em))` : ''};"
>
	{#if hoveredLog}
		<div class="tooltip-title">{FORMATTERS.dateLabel(hoveredLog.aStart)}</div>
		<div class="tooltip-chart">
			<div
				class="tooltip-bar"
				style="width: {scale(hoveredLog.timeToEnd) - scale(hoveredLog.timeToStart)}px;
				background-color:{colorScale(dur)}"
			/>
			<div class="tooltip-duration">{FORMATTERS.hour(dur)} hours</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.tooltip {
		position: absolute;
		transition: transform 50ms, opacity 100ms;
		min-width: 10em;
		min-height: 10px;
		background: #fff;
		color: var(--background-color);
		pointer-events: none;
		margin: 1em;
		padding: 0.5em;
		border-radius: 5px;
		box-shadow: var(--shadow-elevation-medium);

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
			border-color: transparent #fff transparent transparent;
		}

		&.needsFlip::after {
			left: 100%;
			transform: translate(0, -50%);
			border-color: transparent transparent transparent #fff;
		}

		.tooltip-chart {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.tooltip-bar {
				height: 0.5em;
				border-radius: 1em;
				margin-right: 0.5em;
				position: relative;

				&::before,
				&::after {
					content: '';
					height: 1em;
					width: 1px;
					border-left: 1px black solid;
					position: absolute;
					transform: translateY(-25%);
				}

				&::after {
					left: 100%;
				}
			}
		}
	}
</style>

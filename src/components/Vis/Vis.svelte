<script lang="ts">
	import * as d3 from 'd3';
	import { fade } from 'svelte/transition';

	import type { SleepLog } from '$src/data/types';
	import { visMode, selectedThreshold, minHours } from '$src/store';

	import rawAnnotations from '$src/data/annotations.json';
	import { COLOR_SCALE, DATE_RANGE, KEYS, MODES } from '$src/utils/constants';
	import YAxis from './YAxis.svelte';
	import Annotation from './Annotation.svelte';
	import Tooltip from './Tooltip.svelte';

	export let data: [string, any[]][];

	let width;
	let height;
	let padding = { top: 90, bottom: 90, left: 70, right: 50 };
	let tooltipPos: [number, number] | [null, null] = [null, null];
	let hoveredLog: SleepLog | null;

	// X SCALE
	$: xRange =
		$visMode === MODES.RADIAL
			? [-Math.PI / 2, 1.5 * Math.PI]
			: [padding.left, width - padding.right];

	$: xScale = d3.scaleBand().domain(DATE_RANGE).range(xRange).padding(0.2);

	$: bandWidth = Math.min(xScale.bandwidth(), 2);

	$: innerRadius = 60;
	$: radialBarHeight = (Math.min(height, width) - padding.bottom - padding.top - innerRadius) / 2;
	$: outerRadius = radialBarHeight + innerRadius;

	// Y SCALE
	$: yStartMetric = $visMode === MODES.BAR_ABSOLUTE ? KEYS.TIME_TO_START : KEYS.STD_TIME_TO_START;
	$: yEndMetric = $visMode === MODES.BAR_ABSOLUTE ? KEYS.TIME_TO_END : KEYS.STD_TIME_TO_END;
	$: yRange =
		$visMode === MODES.RADIAL ? [radialBarHeight, 0] : [height - padding.bottom, padding.top];
	$: yScale = d3
		.scaleLinear()
		.domain(
			d3.extent(
				data.map(([, arr]) => arr.map((d) => [d[yStartMetric], d[yEndMetric]]).flat()).flat()
			)
		)
		.range(yRange);
	// .nice();

	$: translateGroup = (date: string, radius = outerRadius) => {
		if ($visMode === MODES.RADIAL) {
			const theta = xScale(date);
			const [x, y] = [radius * Math.cos(theta), radius * Math.sin(theta)];
			return `
					translate(${width / 2}px,${height / 2}px ) 
					translate(${x}px, ${y}px)  
					rotate(${theta + Math.PI * 0.5}rad )
					`;
		} else return `translate(${xScale(date)}px, 0)`;
	};

	const handleMouseover = (e: MouseEvent, log: SleepLog) => {
		tooltipPos = [e.offsetX, e.offsetY];
		hoveredLog = log;
	};
	const handleMouseout = (e: MouseEvent, log: SleepLog) => {
		tooltipPos = [null, null];
		hoveredLog = null;
	};

	// only include annotations that exist in domain
	$: annotations = rawAnnotations.filter((a) => xScale.domain().includes(a.date));
	console.log(`rawAnnotations`, rawAnnotations);
</script>

<div class="vis" bind:offsetWidth={width} bind:offsetHeight={height}>
	{#if width && height}
		<svg>
			<defs>
				<filter id="glow">
					<feGaussianBlur stdDeviation=".25" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<g class="x-axis" />
			<YAxis {yScale} {width} {height} {padding} {radialBarHeight} {innerRadius} />
			<g class="annotations">
				{#each annotations as annotation}
					<Annotation
						{annotation}
						{outerRadius}
						{innerRadius}
						{yScale}
						{xScale}
						groupTransform={$visMode === MODES.RADIAL &&
							`translate(${width / 2}px, ${height / 2}px)`}
					/>
				{/each}
			</g>
			<g class="bars" class:hasActiveThresh={$selectedThreshold || $minHours}>
				{#each data as [date, logs], i (date)}
					<g
						style="
				transform: {translateGroup(date)};
				transition-delay: {i * 5}ms;
				"
					>
						{#each logs as log, index (index)}
							<rect
								fill={COLOR_SCALE(log.timeToEnd - log.timeToStart)}
								on:mouseenter={(e) => handleMouseover(e, log)}
								on:mouseleave={(e) => handleMouseout(e, log)}
								in:fade={{ delay: log.id * 1 }}
								class:active={($selectedThreshold &&
									log.timeToEnd - log.timeToStart >= $selectedThreshold[0] &&
									log.timeToEnd - log.timeToStart < $selectedThreshold[1]) ||
									($minHours && logs.maxDuration >= $minHours)}
								style="q
							filter:url(#glow);
							transition-delay: {i * 5}ms;
							transform: translate(0, {yScale(log[yEndMetric])}px);
							width: {$visMode === MODES.RADIAL ? bandWidth * innerRadius : bandWidth}px;
							height: {yScale(log[yStartMetric]) - yScale(log[yEndMetric])}px
							"
							/>
						{/each}
					</g>
				{/each}
			</g>
		</svg>
		<Tooltip
			needsFlip={tooltipPos[0] > width * 0.5}
			{tooltipPos}
			lengthScale={yScale}
			{hoveredLog}
		/>
	{/if}
</div>

<style lang="scss">
	.vis {
		width: 100%;
		height: 100%;
		display: grid;
		// overflow: hidden;
	}

	.vis svg {
		width: 100%;
		height: 100%;
		min-height: 500px;
		padding: 1em;
		overflow: visible;
	}

	.bars {
		rect,
		g {
			transition: transform var(--fast-transition-duration), width var(--slow-transition-duration),
				height var(--slow-transition-duration);
		}

		rect:hover {
			stroke: blanchedalmond;
		}

		&.hasActiveThresh {
			rect:not(.active) {
				opacity: 0.5;
			}
		}
	}
</style>

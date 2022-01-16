<script lang="ts">
	import * as d3 from 'd3';

	import type { AnnotationType, SleepLog } from '$src/data/types';
	import { visMode } from '$src/store';

	import rawData from '$src/data/sleepLogs.csv?raw';
	import rawAnnotations from '$src/data/annotations.json';
	import { COLOR_PALATTE, FORMATTERS, KEYS, MODES } from '$src/utils/constants';
	import YAxis from './YAxis.svelte';
	import Annotation from './Annotation.svelte';

	let width;
	let height;
	let padding = { top: 50, bottom: 150, left: 40, right: 50 };

	// DATA + TRANSFORMATIONS
	let parsedData = d3
		.csvParse<SleepLog>(rawData, d3.autoType)
		.filter((d) => d.Type === 'sleep')
		.map((d, i) => ({ ...d, id: i }));
	let annotations = rawAnnotations.map(
		(a): AnnotationType => ({ ...a, date: FORMATTERS.dateParse(a.date) })
	);

	console.log(`annotations`, annotations);

	/** returns [adjustedDate, [sleepLogs]]*/
	let data = d3.groups(parsedData, (d) => FORMATTERS.date(d.aStart));
	data.forEach(([, arr]) => {
		const minStart = d3.min(arr, (d) => d.timeToStart);
		arr.forEach((log) => {
			log.stdTimeToStart = log.timeToStart - minStart;
			log.stdTimeToEnd = log.timeToEnd - minStart;
		});
	});

	// X SCALE
	$: xRange =
		$visMode === MODES.RADIAL
			? [-Math.PI / 2, 1.5 * Math.PI]
			: [padding.left, width - padding.right];

	$: xScale = d3
		.scaleBand()
		.domain(data.map(([d]) => d))
		.range(xRange)
		.padding(0.2);

	$: innerRadius = 35;
	$: radialBarHeight = (Math.min(height, width) - padding.bottom) / 2;
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
		.range(yRange)
		.nice();

	// COLOR SCALE
	$: colorScale = d3.scaleQuantize(COLOR_PALATTE).domain([0, 12]).nice(); // sleep duration

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
</script>

<div class="vis" bind:clientWidth={width} bind:clientHeight={height}>
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
				<Annotation {translateGroup} {annotation} {outerRadius} {yScale} />
			{/each}
		</g>
		<g class="bars">
			{#each data as [date, logs], i (date)}
				<g
					style="
				transform: {translateGroup(date)};
				transition-delay: {i * 5}ms;
				"
				>
					{#each logs as log, index (index)}
						<rect
							fill={colorScale(log.timeToEnd - log.timeToStart)}
							rx="3"
							style="q
							filter:url(#glow);
							transition-delay: {i * 5}ms;
							transform: translate(0, {yScale(log[yEndMetric])}px);
							width: {$visMode === MODES.RADIAL ? xScale.bandwidth() * innerRadius : xScale.bandwidth()}px;
							height: {yScale(log[yStartMetric]) - yScale(log[yEndMetric])}px
							"
						/>
					{/each}
				</g>
			{/each}
		</g>
	</svg>
</div>

<style lang="scss">
	.vis {
		width: 100%;
		height: 100%;
		display: flex;
	}

	.vis svg {
		width: 100%;
		height: 100%;
		min-height: 500px;
		padding: 1em;
		overflow: visible;
	}

	.bars {
		pointer-events: none;
		rect,
		g {
			transition: transform var(--fast-transition-duration), width var(--slow-transition-duration),
				height var(--slow-transition-duration);
		}
	}
</style>

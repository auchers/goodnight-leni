<script lang="ts">
	import * as d3 from 'd3';
	import { fade } from 'svelte/transition';

	import type { SleepLog } from '$src/data/types';
	import { visMode } from '$src/store';

	import rawData from '$src/data/sleepLogs.csv?raw';
	import { COLOR_PALATTE, FORMATTERS, KEYS, MODES } from '$src/utils/constants';

	let padding = { top: 50, bottom: 150, left: 40, right: 50 };

	let parsedData = d3
		.csvParse<SleepLog>(rawData, d3.autoType)
		.filter((d) => d.Type === 'sleep')
		.map((d, i) => ({ ...d, id: i }));

	/** returns [adjustedDate, [sleepLogs]]*/
	let data = d3.groups(parsedData, (d) => FORMATTERS.date(d.aStart));
	data.forEach(([, arr]) => {
		const minStart = d3.min(arr, (d) => d.timeToStart);
		arr.forEach((log) => {
			log.stdTimeToStart = log.timeToStart - minStart;
			log.stdTimeToEnd = log.timeToEnd - minStart;
		});
	});

	console.log(`data`, data);

	let width = 500;
	let height = 200;

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
	$: radialBarHeight = Math.min(height, width) / 2;
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

	// Y SCALE
	$: colorScale = d3.scaleQuantize(COLOR_PALATTE).domain([0, 12]).nice(); // sleep duration

	$: translateGroup = (date: string) => {
		if ($visMode === MODES.RADIAL) {
			const theta = xScale(date);
			const [x, y] = [outerRadius * Math.cos(theta), outerRadius * Math.sin(theta)];
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
		<g class="y-axis">
			{#if $visMode !== MODES.RADIAL}
				{#each yScale.ticks() as tick, index}
					<g class="tick tick--{tick}" transform="translate(0,{yScale(tick)})" transition:fade>
						<line x2={width - padding.right} />
						<text dy="-.5em"
							>{$visMode === MODES.BAR_ABSOLUTE ? FORMATTERS.yTickFormat(tick) : `${tick} hr`}</text
						>
					</g>
				{/each}
			{:else}
				{#each yScale.ticks().reverse() as tick}
					<g
						class="tick radial"
						transition:fade
						transform={`translate(${width / 2}, ${height / 2})`}
					>
						<circle r={radialBarHeight - yScale(tick) + innerRadius} />
						<text text-anchor="middle" dy="-.5em" y={radialBarHeight - yScale(tick) + innerRadius}
							>{tick} hr</text
						>
					</g>
				{/each}
			{/if}
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
			transition: transform 500ms, width 1000ms, height 600ms;
		}
	}

	.y-axis {
		.tick {
			line,
			circle {
				stroke: var(--text-color-grey);
				stroke-dasharray: 3 5;
				stroke-width: 0.25px;
				fill: transparent;
				cursor: pointer;
			}
			text {
				fill: var(--text-color-grey);
				font-size: 0.8em;
				pointer-events: none;
			}

			&.radial:not(:hover) {
				text {
					opacity: 0;
				}
			}
		}
	}
</style>

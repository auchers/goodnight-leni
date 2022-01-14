<script lang="ts">
	import * as d3 from 'd3';

	import type { SleepLog } from '$src/data/types';
	import { visMode } from '$src/store';

	import rawData from '$src/data/sleepLogs.csv?raw';
	import { FORMATTERS, KEYS, MODES } from '$src/utils/constants';

	let padding = { top: 150, bottom: 150, left: 50, right: 50 };

	let parsedData = d3.csvParse<SleepLog>(rawData, d3.autoType).filter((d) => d.Type === 'sleep');

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

	$: xScale = d3
		.scaleBand()
		.domain(data.map(([d]) => d))
		.range([padding.left, width - padding.right])
		.padding(0.15);

	$: yStartMetric = $visMode === MODES.BAR_ABSOLUTE ? KEYS.TIME_TO_START : KEYS.STD_TIME_TO_START;
	$: yEndMetric = $visMode === MODES.BAR_ABSOLUTE ? KEYS.TIME_TO_END : KEYS.STD_TIME_TO_END;

	$: yScale = d3
		.scaleLinear()
		.domain(
			d3.extent(
				data.map(([, arr]) => arr.map((d) => [d[yStartMetric], d[yEndMetric]]).flat()).flat()
			)
		)
		.range([height - padding.bottom, padding.top]);
</script>

<div class="vis" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<g class="x-axis" />
		<g class="y-axis" />
		<g class="bars">
			{#if data.length}
				{#each data as [date, logs]}
					<g>
						{#each logs as log}
							<rect
								y={yScale(log[yEndMetric])}
								height={yScale(log[yStartMetric]) - yScale(log[yEndMetric])}
								x={xScale(date)}
								width={xScale.bandwidth()}
								fill={'white'}
								rx="3"
							/>
						{/each}
					</g>
				{/each}
			{/if}
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
	}
</style>

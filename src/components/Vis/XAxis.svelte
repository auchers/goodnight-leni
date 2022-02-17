<script lang="ts">
	import { visMode } from '$src/store';
	import { FORMATTERS, MODES, START_DATE } from '$src/utils/constants';

	import type { ScaleBand, ScaleLinear } from 'd3';
	import * as d3 from 'd3';
	import { fade } from 'svelte/transition';

	export let xScale: ScaleBand<string>;
	export let yScale: ScaleLinear<any, any>;

	let textOffset = 10;
	let radiusOffset = 40;

	$: segments = d3.range(6).map((d) => {
		const startDate = new Date(START_DATE);
		startDate.setUTCMonth(startDate.getUTCMonth() + d);

		let endDate = new Date(startDate);
		endDate.setUTCMonth(startDate.getUTCMonth() + 1);

		endDate.setUTCDate(d === 5 ? 20 : 19);
		if ($visMode === MODES.RADIAL) {
			const arc = d3
				.arc()
				.padAngle(0.1)
				.innerRadius(radiusOffset)
				.outerRadius(radiusOffset)
				.startAngle(xScale(FORMATTERS.date(startDate)) + Math.PI * 0.5)
				.endAngle(xScale(FORMATTERS.date(endDate)) + Math.PI * 0.5);
			return arc;
		} else {
			return [xScale(FORMATTERS.date(startDate)), xScale(FORMATTERS.date(endDate))];
		}
	});

	$: textTransform = (arc) => {
		const [x, y] = arc.centroid();
		const centroidTheta = Math.atan2(y, x);
		const [newX, newY] = [
			x - Math.cos(centroidTheta) * textOffset,
			y - Math.sin(centroidTheta) * textOffset
		];
		return `transform: translate(${newX}px, ${newY}px)`;
	};

	$: y = yScale.range()[0] + 20;

	$: {
		console.log(`segments`, segments, $visMode);
	}
</script>

<g class="XAxis">
	{#each segments as arc, i}
		{#if $visMode === MODES.RADIAL}
			<g class="month-arc" in:fade={{ delay: 1000 }}>
				<path d={arc(null)} />
				<text text-anchor="middle" style={textTransform(arc)} dy=".25em">{i + 1}</text>
			</g>
		{:else}
			<g class="month-arc" transform="translate(0,{y})" in:fade={{ delay: 1000 }}>
				<path d={`M ${arc[0]} 0  H ${arc[1]}`} />
				<text text-anchor="middle" x={(arc[0] + arc[1]) / 2} dy="1.25em">{i + 1}</text>
			</g>
		{/if}
	{/each}
</g>

<style lang="scss">
	.XAxis {
		.month-arc {
			// color: lightgrey;
			path {
				stroke: var(--text-color-grey);
				fill: none;
			}
			text {
				fill: var(--text-color-grey);
				font-size: 0.75em;
				cursor: default;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}

			&:not(:hover) {
				text {
					opacity: 0.25;
				}

				path {
					opacity: 0.5;
				}
			}
		}
	}
</style>

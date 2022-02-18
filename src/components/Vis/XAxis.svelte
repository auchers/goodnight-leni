<script lang="ts">
	import { hoveredMonth, visMode } from '$src/store';
	import { FORMATTERS, MODES, START_DATE } from '$src/utils/constants';

	import type { ScaleBand, ScaleLinear } from 'd3';
	import * as d3 from 'd3';
	import { fade } from 'svelte/transition';

	export let xScale: ScaleBand<string>;
	export let yScale: ScaleLinear<any, any>;

	let textOffset = 10;
	let radiusOffset = 50;

	$: segments = d3.range(6).map((d) => {
		const startDate = new Date(START_DATE);
		startDate.setUTCMonth(startDate.getUTCMonth() + d);

		let endDate = new Date(startDate);
		endDate.setUTCMonth(startDate.getUTCMonth() + 1);

		endDate.setUTCDate(19);
		if ($visMode === MODES.RADIAL) {
			const arc = d3
				.arc()
				.padAngle(0.1)
				.innerRadius(radiusOffset)
				.outerRadius(radiusOffset)
				.startAngle(xScale(FORMATTERS.date(startDate)) + Math.PI * 0.5)
				.endAngle(xScale(FORMATTERS.date(endDate)) + Math.PI * 0.5);
			return { arc, startDate, endDate };
		} else {
			return {
				startDate,
				endDate,
				x1: xScale(FORMATTERS.date(startDate)),
				x2: xScale(FORMATTERS.date(endDate))
			};
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
</script>

<g class="XAxis">
	{#each segments as { arc, startDate, endDate, x1, x2 }, i}
		{#if $visMode === MODES.RADIAL}
			<g
				class="month-arc"
				in:fade={{ delay: 1000 }}
				on:mouseenter={() => hoveredMonth.set([startDate, endDate])}
				on:mouseleave={() => hoveredMonth.set(null)}
			>
				<path d={arc(null)} />
				<path class="transparent" d={arc(null)} />
				<text text-anchor="middle" style={textTransform(arc)} dy=".25em">{i + 1}</text>
			</g>
		{:else}
			<g
				class="month-arc"
				transform="translate(0,{y})"
				in:fade={{ delay: 1000 }}
				on:mouseenter={() => hoveredMonth.set([startDate, endDate])}
				on:mouseleave={() => hoveredMonth.set(null)}
			>
				<path d={`M ${x1} 0  H ${x2}`} />
				<text text-anchor="middle" x={(x1 + x2) / 2} dy="1.25em">{i + 1}</text>
			</g>
		{/if}
	{/each}
</g>

<style lang="scss">
	.XAxis {
		.month-arc {
			// color: lightgrey;
			path {
				stroke: var(--text-blue);
				fill: none;

				&.transparent {
					stroke: transparent;
					stroke-width: 50px;
				}
			}

			text {
				fill: var(--text-blue);
				font-size: 0.75em;
				cursor: default;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				stroke-width: 50px;
				stroke: transparent;
			}

			&:not(:hover) {
				text {
					opacity: 0;
				}

				path {
					opacity: 0.5;
				}
			}
		}
	}
</style>

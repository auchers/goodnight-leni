<script>
	import { visMode } from '$src/store';
	import { FORMATTERS, MODES } from '$src/utils/constants';
	import { fade } from 'svelte/transition';

	export let yScale;
	export let width;
	export let height;
	export let padding;
	export let radialBarHeight;
	export let innerRadius;
</script>

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
			<g class="tick radial" transition:fade transform={`translate(${width / 2}, ${height / 2})`}>
				<circle r={radialBarHeight - yScale(tick) + innerRadius} />
				<text text-anchor="middle" dy=".25em" y={radialBarHeight - yScale(tick) + innerRadius}
					>{tick} hr</text
				>
			</g>
		{/each}
	{/if}
</g>

<style lang="scss">
	.y-axis {
		.tick {
			line,
			circle {
				stroke: var(--text-color-grey);
				stroke-dasharray: 3 5;
				stroke-width: 0.5px;
				fill: transparent;
				cursor: pointer;
			}
			text {
				fill: var(--text-color-grey);
				font-size: 0.8em;
				pointer-events: none;
			}

			&.radial:not(:hover) {
				circle {
					stroke-width: 0.25px;
				}
				text {
					opacity: 0;
				}
			}
		}
	}
</style>

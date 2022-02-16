<script>
	import { visMode } from '$src/store';
	import { FORMATTERS, MODES } from '$src/utils/constants';
	import { fade } from 'svelte/transition';

	export let yScale;
	export let width;
	export let padding;
	export let radialBarHeight;
	export let innerRadius;
</script>

<g class="y-axis">
	{#if $visMode === MODES.RADIAL}
		<g>
			<text class="caps radial" text-anchor="middle" dy=".25em">bedtime</text>
			{#each yScale.ticks(5).reverse() as tick}
				<g class="tick radial" in:fade>
					<circle r={radialBarHeight - yScale(tick) + innerRadius} />
					<text
						class="caps"
						text-anchor="middle"
						dy=".25em"
						y={radialBarHeight - yScale(tick) + innerRadius}>{tick} hours since bedtime</text
					>
				</g>
			{/each}
		</g>
	{:else}
		<text class="caps" transform="translate(0, {yScale.range()[1]})">wake up</text>
		{#each yScale.ticks(5) as tick}
			<g class="tick tick--{tick}" transform="translate(0,{yScale(tick)})" transition:fade>
				<line x2={width - padding.right} />
				<text dy="-.5em"
					>{$visMode === MODES.BAR_ABSOLUTE ? FORMATTERS.yTickFormat(tick) : `${tick} hr`}</text
				>
			</g>
		{/each}
		<text class="caps" transform="translate(0, {yScale.range()[0]})" dy="1em">bedtime</text>
	{/if}
</g>

<style lang="scss">
	.y-axis {
		opacity: 0.8;
		font-weight: 200;

		text {
			fill: var(--text-color-grey);
		}

		.caps {
			font-variant: all-small-caps;
		}

		.tick {
			line,
			circle {
				stroke: var(--text-color-grey);
				stroke-dasharray: 3 7;
				stroke-width: 1px;
				fill: none;
				cursor: pointer;
			}
			text {
				font-size: 0.9em;
				pointer-events: none;
				paint-order: stroke;
				stroke: #535353;
				stroke-width: 1px;
			}

			&.radial {
				circle {
					stroke-width: 0.25px;
				}
				&:not(:first-of-type) text {
					opacity: 0;
				}
			}
		}
	}
</style>

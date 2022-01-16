<script lang="ts">
	import type { AnnotationType } from '$src/data/types';
	import { visMode } from '$src/store';
	import { FORMATTERS, MODES } from '$src/utils/constants';
	import { fade } from 'svelte/transition';

	export let outerRadius;
	export let yScale;
	export let xScale;
	export let annotation: AnnotationType;

	let r = 7;
	let dx = 0.5; //em
	const { date, title } = annotation;

	$: lineLength = $visMode === MODES.RADIAL ? outerRadius + 50 : yScale.range()[0];
	$: theta = xScale(date);
	$: [x, y] = [lineLength * Math.cos(theta), lineLength * Math.sin(theta)];
	$: rotation = theta + Math.PI * 0.5;

	$: transform = `translate(${x}px, ${y}px)rotate(${rotation}rad)`;
</script>

{#if $visMode === MODES.RADIAL}
	<g class="annotation">
		<g
			class="annotation-line"
			style="transform: {transform};"
			in:fade={{ delay: 1000 }}
			out:fade={{ delay: 0 }}
		>
			<line y1={0} y2={outerRadius} />
			<circle {r} />
		</g>

		<g
			class="annotation-text"
			style="transform: translate({x}px, {y}px)"
			text-anchor={x >= 0 ? 'start' : 'end'}
		>
			<text class="annotation-title" dy="-.75em" dx={x > outerRadius / 2 ? `${dx}em` : `${-dx}em`}
				>{title}</text
			>
			<text class="annotation-date" dy="-2.5em" dx={x > outerRadius / 2 ? `${dx}em` : `${-dx}em`}
				>{date}</text
			>
		</g>
	</g>
{/if}

<style lang="scss">
	.annotation {
		cursor: pointer;
		line {
			stroke: var(--text-color-grey);
			stroke-dasharray: 3 5;
			stroke-width: 0.5px;
		}

		circle {
			fill: #777c7f;
			transition: transform 200ms;
		}

		text {
			fill: var(--text-color-grey);
			font-weight: 200;
			opacity: 0;

			&.annotation-date {
				font-size: 0.75em;
			}
		}

		&:hover {
			circle {
				transform: scale(1.5);
			}

			text {
				opacity: 1;
			}
		}
	}
</style>

<script lang="ts">
	import type { AnnotationType } from '$src/data/types';
	import { visMode } from '$src/store';
	import { MODES } from '$src/utils/constants';
	import { fade } from 'svelte/transition';
	import Event from '$src/assets/Event.svg';
	import Growth from '$src/assets/Growth.svg';
	import Flight from '$src/assets/Flight.svg';

	export let outerRadius;
	export let innerRadius;
	export let yScale;
	export let xScale;
	export let annotation: AnnotationType;

	let dx = 30; // px
	let baseDy = 40; // px
	let annotationPadding = 10; // length from outerradius
	const { date, title } = annotation;

	$: lineLength =
		$visMode === MODES.RADIAL
			? outerRadius + annotationPadding
			: yScale.range()[0] - yScale.range()[1];
	$: theta = xScale(date);

	$: [x, y] =
		$visMode === MODES.RADIAL
			? [lineLength * Math.cos(theta), lineLength * Math.sin(theta)]
			: [theta, yScale.range()[1]];
	$: rotation = $visMode === MODES.RADIAL ? theta + Math.PI * 0.5 : 0;

	$: transform = `translate(${x}px, ${y}px)rotate(${rotation}rad)`;
	$: textAnchor = $visMode === MODES.RADIAL ? (x >= 0 ? 'start' : 'end') : 'start';
	$: calcDx = $visMode === MODES.RADIAL ? Math.cos(theta) * dx : -10;
	$: calcDy = $visMode === MODES.RADIAL ? Math.sin(theta) * baseDy : -baseDy;
	$: Icon = annotation.type === 'event' ? Event : annotation.type === 'growth' ? Growth : Flight;
</script>

{#key $visMode}
	<g class="annotation">
		<g class="annotation-line" style="transform: {transform};" in:fade={{ delay: 1000 }}>
			<line y1={0} y2={$visMode === MODES.RADIAL ? lineLength - innerRadius : lineLength} />
			<g class="icon">
				<svelte:component
					this={Icon}
					width="1.5em"
					height="1.5em"
					preserveAspectRatio="xMidYMid meet"
				/>
			</g>
		</g>

		<g
			class="annotation-text"
			style="transform: translate({x + calcDx}px, {y + calcDy}px)"
			text-anchor={textAnchor}
		>
			<text class="annotation-date" dy="-.6em">{date}</text>
			<text class="annotation-title" dy=".6em">{title}</text>
		</g>
	</g>
{/key}

<style lang="scss">
	.annotation {
		cursor: pointer;

		.annotation-line {
			line {
				stroke: var(--text-blue);
				// stroke-dasharray: 3 5;
				stroke-width: 0.25px;
			}
		}

		.icon {
			transform: translate(-0.75em, -1.5em);
			width: 0.5em;
			fill: transparent;

			&:not(:hover) {
				opacity: 0.5;
			}
		}

		text {
			fill: var(--text-blue);
			font-weight: 200;
			opacity: 0;
			pointer-events: none;

			&.annotation-date {
				font-size: 0.75em;
			}
		}

		&:hover {
			text {
				opacity: 1;
			}
		}
	}
</style>

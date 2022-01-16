<script lang="ts">
	import type { AnnotationType } from '$src/data/types';
	import { visMode } from '$src/store';
	import { FORMATTERS, MODES } from '$src/utils/constants';
	import { fade } from 'svelte/transition';

	export let outerRadius;
	export let yScale;
	export let annotation: AnnotationType;
	export let translateGroup: (date: string, radius?: number) => string;

	let r = 7;
	let paddingBottom = 40;

	$: lineLength = $visMode === MODES.RADIAL ? outerRadius + 50 : yScale.range()[0];
	$: transform = translateGroup(annotation.date, lineLength);
</script>

{#if $visMode === MODES.RADIAL}
	<g
		class="annotation"
		style="transform: {transform};"
		in:fade={{ delay: 1000 }}
		out:fade={{ delay: 0 }}
	>
		<line y1={0} y2={outerRadius} />
		<circle {r} />
	</g>
{/if}

<style lang="scss">
	.annotation {
		transition: transform var(--fast-transition-duration);
		line {
			stroke: var(--text-color-grey);
			stroke-dasharray: 3 5;
			stroke-width: 0.5px;
		}

		circle {
			fill: #777c7f;
			transition: transform 200ms;
		}

		&:hover circle {
			transform: scale(1.5);
		}
	}
</style>

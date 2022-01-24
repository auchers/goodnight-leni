<script lang="ts">
	import { xlink_attr } from 'svelte/internal';

	export let tooltipPos: [number, number] | [null, null];
	$: [x, y] = tooltipPos;
</script>

<div class="tooltip" class:visible={x && y} style="transform:translate({x}px,{y}px);">
	<slot>default slot</slot>
</div>

<style lang="scss">
	.tooltip {
		position: absolute;
		transition: transform 50ms, opacity 100ms;
		width: 10em;
		min-height: 10px;
		background: var(--text-color-grey);
		color: var(--background-color);
		pointer-events: none;
		margin: 1em;
		padding: 0.5em;
		border-radius: 5px;
		box-shadow: var(--shadow-elevation-medium);

		&:not(.visible) {
			opacity: 0;
		}
	}
</style>

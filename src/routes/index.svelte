<script lang="ts">
	import Vis from '$components/Vis/Vis.svelte';
	import { visMode } from '$src/store';
	import { MODES } from '$src/utils/constants';
	import Absolute from '$src/assets/Absolute.svg';
	import Relative from '$src/assets/Relative.svg';
	import Radial from '$src/assets/Radial.svg';

	import '../app.scss';
	import ColorLegend from '$src/components/Vis/ColorLegend.svelte';

	let highlightedChart: MODES | null = null;

	function setMode(mode: MODES) {
		visMode.set(mode);
	}

	function setHoveredChart(mode: MODES | null) {
		highlightedChart = mode;
	}
</script>

<div class="main-grid">
	<div class="right-panel">
		<header>
			<h1>Goodnight Leni</h1>
			<p>Tracking the first six months of newborn sleep</p>
		</header>
		<div>
			<p><span class="caps">View As:</span> {highlightedChart || $visMode}</p>
			<div class="buttons">
				<button
					class="radial"
					title="radial chart"
					on:click={() => setMode(MODES.RADIAL)}
					class:active={MODES.RADIAL === $visMode}
					on:mouseenter={() => setHoveredChart(MODES.RADIAL)}
					on:mouseleave={() => setHoveredChart(null)}
					><Radial />
				</button>
				<button
					title="absolute bar chart"
					on:click={() => setMode(MODES.BAR_ABSOLUTE)}
					class:active={MODES.BAR_ABSOLUTE === $visMode}
					on:mouseenter={() => setHoveredChart(MODES.BAR_ABSOLUTE)}
					on:mouseleave={() => setHoveredChart(null)}><Absolute /></button
				>
				<button
					title="relative bar chart"
					on:click={() => setMode(MODES.BAR_RELATIVE)}
					class:active={MODES.BAR_RELATIVE === $visMode}
					on:mouseenter={() => setHoveredChart(MODES.BAR_RELATIVE)}
					on:mouseleave={() => setHoveredChart(null)}><Relative /></button
				>
			</div>
			<p><span class="caps">Highlight By:</span></p>
			<ColorLegend />
		</div>
	</div>
	<Vis />
</div>

<style lang="scss">
	.main-grid {
		display: grid;
		grid-template-columns: min-content 1fr;
		width: 100vw;
		height: 100vh;
		padding: 1rem 3rem;
	}

	.right-panel {
		padding: 2em;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
	}

	.caps {
		font-variant: all-small-caps;
		font-size: 1.25em;
		font-weight: 500;
		opacity: 0.7;
	}

	header {
		height: min-content;

		h1 {
			font-size: 4.5em;
			line-height: 0.9em;
		}
	}

	p {
		margin: 0.5em 0;
	}

	.buttons {
		margin-bottom: 1.5em;
		display: flex;

		:not(.active) {
			opacity: 0.5;
		}

		:hover {
			opacity: 0.6;
		}

		button {
			padding: 0 0.25em;
			width: 1.5em;
			height: 2em;
			overflow: hidden;
			margin-right: 0.5em;

			&.radial {
				width: 2em;
			}
		}
	}

	button {
		all: unset;
		cursor: pointer;
	}
</style>

<script lang="ts" context="module">
	import Vis from '$components/Vis/Vis.svelte';
	import { visMode } from '$src/store';
	import { MODES } from '$src/utils/constants';
	import Absolute from '$src/assets/Absolute.svg';
	import Relative from '$src/assets/Relative.svg';
	import Radial from '$src/assets/Radial.svg';

	import '../app.scss';

	function setMode(mode: MODES) {
		visMode.set(mode);
	}
</script>

<div class="main-grid">
	<header>
		<h1>Goodnight Leni</h1>
		<p>Tracking the first 6 months of newborn sleep</p>
	</header>
	<div class="buttons">
		<button
			title="switch to absolute bar chart"
			on:click={() => setMode(MODES.BAR_ABSOLUTE)}
			class:active={MODES.BAR_ABSOLUTE === $visMode}><Absolute /></button
		>
		<button
			title="switch to relative bar chart"
			on:click={() => setMode(MODES.BAR_RELATIVE)}
			class:active={MODES.BAR_RELATIVE === $visMode}><Relative /></button
		>

		<button
			title="switch to radial chart"
			on:click={() => setMode(MODES.RADIAL)}
			class:active={MODES.RADIAL === $visMode}><Radial /></button
		>
	</div>
	<Vis />
</div>

<style lang="scss">
	.main-grid {
		display: grid;
		grid-template-rows: min-content min-content 1fr;
		width: 100vw;
		height: 100vh;
		padding: 1rem 3rem;
	}

	header {
		height: min-content;
		padding-bottom: 0.5em;
		padding-left: 0.5em;

		h1 {
			font-size: 4em;
		}
		// -webkit-text-stroke-width: 3px;
		// -webkit-text-stroke-color: black;
	}

	.buttons {
		padding: 0.5em;

		:not(.active) {
			opacity: 0.5;
		}

		button {
			padding: 0.25em;
			width: 2em;
		}
	}

	button {
		all: unset;
		cursor: pointer;
	}
</style>

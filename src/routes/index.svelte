<script lang="ts">
	import Vis from '$components/Vis/Vis.svelte';
	import { visMode } from '$src/store';
	import { MODES } from '$src/utils/constants';
	import '../app.scss';

	function setMode(mode: MODES) {
		visMode.set(mode);
	}
</script>

<div class="main-grid">
	<header>Goodnight Leni</header>
	<div class="buttons">
		<button on:click={() => setMode(MODES.BAR_ABSOLUTE)}>bar (absolute)</button>
		<button on:click={() => setMode(MODES.BAR_RELATIVE)}>bar (relative)</button>
		<button on:click={() => setMode(MODES.RADIAL)}>radial (relative)</button>
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
		font-size: 4em;
		-webkit-text-stroke-width: 3px;
		-webkit-text-stroke-color: black;
	}

	.buttons {
		padding: 0.5em;
	}

	button {
		padding: 0.5em;
	}
</style>

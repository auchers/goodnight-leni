<script>
	import Vis from '$components/Vis/Vis.svelte';
	import '../app.scss';
</script>

<div class="main-grid">
	<header>Vis work in progress</header>
	<Vis />
</div>

<style lang="scss">
	.main-grid {
		display: grid;
		grid-template-rows: min-content 1fr;
		width: 100vw;
		height: 100vh;
	}

	header {
		padding: 1em;
		height: min-content;
	}
</style>

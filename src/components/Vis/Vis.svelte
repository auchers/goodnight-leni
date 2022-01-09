<script>
	import { visMode } from '$src/store';

	let width = 500;
	let height = 200;

	$: {
		console.log(`width, height`, width, height);
	}
</script>

<div class="vis" bind:clientWidth={width} bind:clientHeight={height}>
	<h1>{$visMode}</h1>
</div>

<style lang="scss">
	.vis {
		width: 100%;
		height: 100%;
		border: white 3px dashed;
	}
</style>

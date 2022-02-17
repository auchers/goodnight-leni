<script lang="ts">
	import imgURL from '$src/assets/FallbackImage.png';
</script>

<div class="fallback">
	<header>
		<h1>Goodnight Leni</h1>
		<p>Tracking the first six months of newborn sleep</p>
	</header>
	<div class="image-container">
		<img src={imgURL} alt="fallback of radial barchart" />
	</div>
	<div class="disclaimer">
		<p>This project was designed for larger screens.</p>
		<p>Visit on a larger screen to explore.</p>
	</div>
</div>

<style lang="scss">
	.fallback {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-shrink: 0;
		flex-wrap: wrap;
		padding: 1em;

		header {
			padding: 1em 0;
			// font-size: 3em;
			// line-height: 0.9em;
		}

		.image-container {
			margin-top: 2em;
		}

		img {
			max-width: 100%;
			max-height: 100%;
			width: auto;
			height: auto;
		}

		.disclaimer {
			width: 100%;
			text-align: center;
			font-family: 'Poiret One', sans-serif;
		}
	}
</style>

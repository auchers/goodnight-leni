<script>
	import MobileFallback from '$src/components/MobileFallback.svelte';

	let pauseTransitionTimer;
	let width;
	const pauseTransitions = () => {
		document.body.classList.add('no-transition');
		clearTimeout(pauseTransitionTimer);
		pauseTransitionTimer = setTimeout(() => {
			document.body.classList.remove('no-transition');
		}, 400);
	};

	$: isMobile = width <= 768;
</script>

<svelte:window on:resize={pauseTransitions} bind:innerWidth={width} />
{#if isMobile}
	<MobileFallback />
{:else}
	<slot />
{/if}

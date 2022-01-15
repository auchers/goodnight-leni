<script>
	let pauseTransitionTimer;
	const pauseTransitions = () => {
		document.body.classList.add('no-transition');
		clearTimeout(pauseTransitionTimer);
		pauseTransitionTimer = setTimeout(() => {
			document.body.classList.remove('no-transition');
		}, 400);
	};
</script>

<svelte:window on:resize={pauseTransitions} />
<slot />

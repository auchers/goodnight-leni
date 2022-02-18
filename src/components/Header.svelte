<header>
	<h1 data-before="Goodnight Leni">Goodnight Leni</h1>
	<p data-before="Six months of newborn sleep">Six months of newborn sleep</p>
</header>

<style lang="scss">
	header {
		color: var(--text-light-blue);
		height: min-content;
		position: relative;

		h1 {
			font-family: 'Poiret One', sans-serif;
			font-size: 5em;
			line-height: 0.9em;
		}

		p {
			font-family: 'Roboto', sans-serif;
			font-weight: 300;
			font-size: 24px;
			line-height: unset;
			margin-top: 0.5em;
		}

		h1:before,
		p:before {
			content: attr(data-before);
			position: absolute;
			color: var(--text-yellow-shadow);
			filter: blur(12px);
			opacity: 0.5;
		}
	}
</style>

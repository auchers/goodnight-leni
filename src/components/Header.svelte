<script lang="ts">
	import Logo from '$src/assets/WebsiteLogo.svg';
	import GHIcon from '$src/assets/githubIcon.svg';
</script>

<header>
	<h1 data-before="Goodnight Leni">Goodnight Leni</h1>
	<p data-before="Six months of newborn sleep">Six months of newborn sleep</p>
	<br />
	<div class="author-info">
		<div>Created by Aucher Serr, 2022</div>
		<div class="icons">
			<a href="https://www.aucherserr.com" target="_blank" title="personal website"><Logo /></a>
			<a href="https://github.com/auchers/goodnight-leni" target="_blank" title="github"
				><GHIcon /></a
			>
		</div>
	</div>
</header>

<style lang="scss">
	header {
		color: var(--text-light-blue);
		height: min-content;
		position: relative;

		h1 {
			font-family: 'Poiret One', sans-serif;
			font-size: 5.5em;
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
			filter: blur(10px);
			opacity: 0.5;
		}

		.author-info {
			opacity: 0.3;
			font-family: 'Roboto', sans-serif;
			font-size: 1em;
			color: var(--font-blue);
			font-weight: 200;
		}
	}

	@media (max-width: 1000px) {
		header {
			h1 {
				font-size: 4.1em;
			}
			p {
				font-size: 18px;
			}
		}
	}
</style>

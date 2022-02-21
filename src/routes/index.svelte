<script lang="ts">
	import * as d3 from 'd3';
	import rawData from '$src/data/sleepLogs.csv?raw';
	import type { SleepLog } from '$src/data/types';

	import Vis from '$components/Vis/Vis.svelte';
	import { minHours, visMode } from '$src/store';
	import { FORMATTERS, MODES } from '$src/utils/constants';
	import Absolute from '$src/assets/Absolute.svg';
	import Relative from '$src/assets/Relative.svg';
	import Radial from '$src/assets/Radial.svg';
	import ColorLegend from '$src/components/Vis/ColorLegend.svelte';
	import Header from '$src/components/Header.svelte';

	import '../app.scss';

	// DATA + TRANSFORMATIONS
	let parsedData = d3.csvParse<SleepLog>(rawData, d3.autoType).map((d, i) => ({ ...d, id: i }));

	/** returns [adjustedDate, [sleepLogs]]*/
	let data = d3.groups(parsedData, (d) => FORMATTERS.date(d.aStart));
	data.forEach(([, arr]) => {
		const minStart = d3.min(arr, (d) => d.timeToStart);
		arr.forEach((log) => {
			log.stdTimeToStart = log.timeToStart - minStart;
			log.stdTimeToEnd = log.timeToEnd - minStart;
		});
		const maxDuration = d3.max(arr, (d) => d.timeToEnd - d.timeToStart);
		arr.maxDuration = maxDuration;
	});

	let highlightedChart: MODES | null = null;

	function setHoveredChart(mode: MODES | null) {
		highlightedChart = mode;
	}

	function setMinHours(e: Event) {
		const input = e.target as HTMLInputElement;
		minHours.set(+input.value || null);
	}

	$: sumNights = data.filter(([, arr]) => arr.maxDuration >= $minHours).length;
</script>

<div class="main-grid">
	<div class="left-panel">
		<Header />
		<div class="selections">
			<div class="selection view-as">
				<p><span class="caps">View As:</span> {highlightedChart || $visMode}</p>
				<div class="buttons">
					<button
						class="radial"
						title="radial chart"
						on:click={() => visMode.set(MODES.RADIAL)}
						class:active={MODES.RADIAL === $visMode}
						on:mouseenter={() => setHoveredChart(MODES.RADIAL)}
						on:mouseleave={() => setHoveredChart(null)}
						><Radial />
					</button>
					<button
						title="relative bar chart"
						on:click={() => visMode.set(MODES.BAR_RELATIVE)}
						class:active={MODES.BAR_RELATIVE === $visMode}
						on:mouseenter={() => setHoveredChart(MODES.BAR_RELATIVE)}
						on:mouseleave={() => setHoveredChart(null)}><Relative /></button
					>
					<button
						title="absolute bar chart"
						on:click={() => visMode.set(MODES.BAR_ABSOLUTE)}
						class:active={MODES.BAR_ABSOLUTE === $visMode}
						on:mouseenter={() => setHoveredChart(MODES.BAR_ABSOLUTE)}
						on:mouseleave={() => setHoveredChart(null)}><Absolute /></button
					>
				</div>
			</div>
			<div class="selection highlight-by">
				<p><span class="caps">Highlight By:</span> # of Hours Slept</p>
				<ColorLegend />
			</div>
		</div>
	</div>
	{#if data}
		<div class="right-panel">
			<Vis {data} />
			<div class="summary">
				<span class="conclusion caps"> Number of nights she slept at least </span><input
					min="0"
					max="15"
					class="hours"
					type="number"
					placeholder="0"
					bind:value={$minHours}
				/><span class="caps"> hours straight: </span>
				<span>
					{sumNights} nights ({FORMATTERS.pct(sumNights / data.length)})
				</span>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.main-grid {
		display: grid;
		grid-template-columns: min-content 1fr;
		width: 100vw;
		height: 100vh;
		padding: 1rem 2rem;
		padding-right: 5em;
		padding-bottom: 2em;
	}

	.left-panel {
		padding: 2em;
		padding-bottom: 0;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
	}

	.right-panel {
		display: grid;
		grid-template-rows: 1fr min-content;
		align-items: center;
	}

	.selections {
		display: flex;
		flex-shrink: 0;

		.selection {
			margin-right: 1em;
			display: flex;
			flex-wrap: wrap;
			justify-items: space-between;
			width: 200px;
		}

		.view-as {
			white-space: nowrap;
		}
	}

	.conclusion {
		margin-top: 1em;
	}
	input.hours {
		width: 2em;
		border-bottom: grey 1px dashed;
		font-size: 1em;
		color: var(--text-blue);

		&:focus {
			outline: none;
		}
		&::placeholder {
			color: var(--text-blue);
		}
	}

	.summary {
		font-size: 1em;
		font-weight: 400;
		text-align: center;
		padding-top: 1em;
	}

	.caps {
		font-size: 18px;
		font-weight: 300;
		opacity: 0.7;
	}

	p {
		margin: 0.5em 0;
	}

	.buttons {
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

	@media (max-width: 1000px) {
		.main-grid {
			grid-template-columns: 1fr;
			padding-right: unset;
		}

		.left-panel {
			padding: 0.75em 0;
			width: min-content;
			margin: auto;
			justify-content: space-around;
		}

		.caps,
		p,
		.summary {
			font-size: 1em;
		}

		.buttons {
			margin-bottom: 0.25em;

			button {
				width: 1em;

				&.radial {
					width: 1.5em;
				}
			}
		}
	}
</style>

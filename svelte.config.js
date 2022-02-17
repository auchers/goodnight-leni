// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import path from 'path';
import svg from '@poppanator/sveltekit-svg';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? '' : '/goodnight-leni'
		},
		appDir: 'internal',
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$src: path.resolve('./src'),
					$utils: path.resolve('./src/utils'),
					$components: path.resolve('./src/components')
				}
			},
			plugins: [
				svg({
					svgoOptions: {
						plugins: [
							{
								name: 'preset-default',
								params: {
									overrides: { removeViewBox: false }
								}
							}
						]
					}
				})
			]
		}
	}
};

export default config;

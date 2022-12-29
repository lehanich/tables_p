// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData:`@import 'src/layout/styles/variables.scss';
				@import 'src/layout/styles/index.scss';`
		}
	}),

	kit: {
		// adapter: adapter()
		adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: "index.html",
      precompress: false,
      strict: false // true
    })
	}
};

export default config;

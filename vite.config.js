import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
			'/api': 'http://localhost:3000',
		},
	},
	// scss: {
  //   includePaths: ['src', 'layout/styles'], // <-- Добавим в массив 'static/styles'
  //   prependData: `@import 'index.scss';`, // <-- Добавим эту строку
  // },
	build: {
    commonjsOptions: {
      dynamicRequireTargets: [
        'src/lib/my.worker',
      ],
    },
		rollupOptions: {
			input: {
					// main: "index.html",
					// worker: "src/lib/"
			}
		},
		// manifest: true
	},
};

export default config;

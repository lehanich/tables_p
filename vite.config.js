import { sveltekit } from '@sveltejs/kit/vite';
import path from "path";
import { resolve } from 'path'
const pathSrc = path.resolve(__dirname, "./src");

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
	css: {
		// preprocessorOptions: {
		// 	scss: {
		// 		additionalData: `@import "static/styles/variables.scss";`//${pathSrc}/layout
		// 	}
		// }
	},
	build: {
    commonjsOptions: {
      dynamicRequireTargets: [
        'src/lib/my.worker',
      ],
    },
		rollupOptions: {
			input: {
				main: resolve(pathSrc, 'app.html'),
					// main: "index.html",
					// worker: "src/lib/"
			}
		},
		// manifest: true
	},
};

export default config;

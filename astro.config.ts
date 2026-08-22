import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import alpine from "@astrojs/alpinejs";
import compress from "astro-compress";

const isDev = process.env.NODE_ENV == "development";

// https://astro.build/config
export default defineConfig({
	adapter: isDev ? undefined : netlify(),
	server: {
		port: 4555,
	},
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				alpinejs: "@alpinejs/csp",
				"@": path.resolve(__dirname, "./src"),
			},
		},
	},
	integrations: [
		alpine({ entrypoint: "/src/alpine/entrypoint.js" }),
		// Compress HTML, CSS, and JS
		...(isDev
			? []
			: [
					compress({
						CSS: true,
						HTML: {
							"html-minifier-terser": {
								removeAttributeQuotes: false,
								minifyCSS: true,
								minifyJS: true,
								removeComments: true,
							},
						},
						Image: true,
						JavaScript: true,
						SVG: false,
						Logger: 1,
					}),
				]),
	],
});

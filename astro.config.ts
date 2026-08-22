import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import alpine from "@astrojs/alpinejs";

const isDev = process.env.NODE_ENV == "development";

// https://astro.build/config
export default defineConfig({
	adapter: isDev ? undefined : netlify(),

	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				alpinejs: "@alpinejs/csp",
			},
		},
	},
	integrations: [
		alpine({ entrypoint: "/src/alpine/entrypoint.js" }),
	]
});

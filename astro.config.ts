import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import alpine from "@astrojs/alpinejs";

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
	integrations: [alpine({ entrypoint: "/src/alpine/entrypoint.js" })],
});

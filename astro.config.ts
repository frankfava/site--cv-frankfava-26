import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import alpine from "@astrojs/alpinejs";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import { astroBuilderHelper } from "./integrations/astroBuilderHelper";
import { astroSiteConfigHelper } from "./integrations/astroSiteConfigHelper";

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
				"site:config": path.resolve(__dirname, "./src/siteConfig.ts"),
				"@": path.resolve(__dirname, "./src"),
			},
		},
	},
	integrations: [
		alpine({ entrypoint: "/src/alpine/entrypoint.js" }),
		// Config
		astroSiteConfigHelper(),
		// Build Sitemap
		sitemap(),
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
		// Icon
		icon({
			iconDir: "src/assets/icons",
			include: {
				devicon: ["*"],
				phosphor: ["*"],
			},
		}),
		// Update `robots.txt` with `sitemap-index.xml
		astroBuilderHelper(),
	],
});

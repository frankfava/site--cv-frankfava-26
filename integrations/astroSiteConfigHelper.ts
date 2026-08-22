/**
 * Get Setup Values from ENV file and add to astro config
 */
import type { AstroIntegration } from "astro";
import { loadEnv } from "vite";

const env = loadEnv(process.env?.NODE_ENV ?? "development", process.cwd(), "");

export function astroSiteConfigHelper(): AstroIntegration {
	return {
		name: "astro:site-config:helper",
		hooks: {
			"astro:config:setup": async ({ config, updateConfig }) => {
				import.meta.env.ROOT_DIR = config.root.pathname;
				import.meta.env.PUBLIC_DIR = config.publicDir.pathname;
				globalThis.SITE_URL = env.SITE_URL || import.meta.env.URL || undefined;
				globalThis.BASE_URL = env.BASE_URL || import.meta.env.BASE_URL || "/";
				globalThis.TRAILING_SLASH = env.TRAILING_SLASH != undefined && env.TRAILING_SLASH != "" ? (!!env.TRAILING_SLASH ? "always" : "never") : "ignore";

				updateConfig({
					site: globalThis.SITE_URL,
					base: globalThis.BASE_URL,
					trailingSlash: globalThis.TRAILING_SLASH,
				});
			},
		},
	};
}

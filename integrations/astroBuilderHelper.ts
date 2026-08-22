import fs from "node:fs";
import os from "node:os";
import type { AstroConfig, AstroIntegration } from "astro";

const loggerId = "astroBuildHelper";

export function astroBuilderHelper(): AstroIntegration {
	let cfg: AstroConfig;

	return {
		name: "astro:build:helper",
		hooks: {
			"astro:config:done": async ({ config }: { config: AstroConfig }) => {
				cfg = config;
			},
			"astro:build:done": async ({ logger }) => {
				const buildLogger = logger.fork(loggerId);

				try {
					const outDir = cfg.outDir;
					const publicDir = cfg.publicDir;
					const sitemapName = "sitemap-index.xml";
					const sitemapFile = new URL(sitemapName, outDir);
					const robotsTxtFile = new URL("robots.txt", publicDir);
					const robotsTxtFileInOut = new URL("robots.txt", outDir);

					const hasIntegration = Array.isArray(cfg?.integrations) && cfg.integrations?.find((e) => e?.name === "@astrojs/sitemap") !== undefined;
					const sitemapExists = fs.existsSync(sitemapFile);

					if (hasIntegration && sitemapExists && cfg.site) {
						buildLogger.info("Updating `robots.txt` with `sitemap-index.xml` ...");

						const robotsTxt = fs.readFileSync(robotsTxtFile, {
							encoding: "utf8",
							flag: "a+",
						});
						const sitemapUrl = new URL(sitemapName, String(new URL(cfg.base, cfg.site)));
						const pattern = /^Sitemap:(.*)$/m;

						if (!pattern.test(robotsTxt)) {
							fs.writeFileSync(robotsTxtFileInOut, `${robotsTxt}${os.EOL}${os.EOL}Sitemap: ${sitemapUrl}`, {
								encoding: "utf8",
								flag: "w",
							});
						} else {
							fs.writeFileSync(robotsTxtFileInOut, robotsTxt.replace(pattern, `Sitemap: ${sitemapUrl}`), {
								encoding: "utf8",
								flag: "w",
							});
						}
					} else {
						if (!hasIntegration) {
							buildLogger.warn("Could not update `robots.txt`. Integration `@astrojs/sitemap` cannot be found.");
						}
						if (!cfg.site) {
							buildLogger.warn("Could not update `robots.txt`. `site` not set in Astro config.");
						}
					}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (error) {
					/* empty */
				}
			},
		},
	};
}

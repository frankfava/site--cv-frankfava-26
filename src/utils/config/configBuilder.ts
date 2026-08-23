/**
 * Config Utility
 */
import type { Config } from "@/types/config";
import { createSocialsManager } from "@/lib/socials";

/** Modify config to add utility */
export function addUtils(config: Config.Complete) {
	// Site Config
	const site: Config.Final["site"] = {
		...config.site,
		getCanonical: (path = ""): string | URL => {
			const url = String(new URL(path, config.site.site));
			if (config.site.trailingSlash == false && path && url.endsWith("/")) {
				return url.slice(0, -1);
			} else if (config.site.trailingSlash == true && path && !url.endsWith("/")) {
				return url + "/";
			}
			return url;
		},
	};

	// Metadata
	const metadata: Config.Final["metadata"] = config.metadata;

	// i18N
	const i18n: Config.Final["i18n"] = config.i18n;

	// Analytics
	const analytics: Config.Final["analytics"] = {
		...config.analytics,
		googleSiteVerificationId: import.meta.env.GOOGLE_SITE_VERIFICATION_ID,
		...(config.analytics.vendor === "fathom"
			? {
					fathom: {
						siteId: import.meta.env.FATHOM_SITE_ID,
						scriptUrl: import.meta.env.FATHOM_SCRIPT_URL,
					},
				}
			: {}),
		...(config.analytics.vendor === "googleAnalytics" || config.analytics.vendor === "minimalAnalytics"
			? {
					googleAnalytics: {
						id: import.meta.env.GOOGLE_ANALYTICS_ID,
					},
				}
			: {}),
		...(config.analytics.vendor === "metrical"
			? {
					metrical: {
						appId: import.meta.env.METRICAL_APP_ID,
					},
				}
			: {}),
		...(config.analytics.vendor === "plausible"
			? {
					plausible: {
						domain: import.meta.env.PLAUSIBLE_DOMAIN,
						scriptUrl: import.meta.env.PLAUSIBLE_SCRIPT_URL,
					},
				}
			: {}),
		...(config.analytics.vendor === "umami"
			? {
					umami: {
						id: import.meta.env.UMAMI_ID,
						scriptUrl: import.meta.env.UMAMI_SCRIPT_URL,
					},
				}
			: {}),
		...(config.analytics.vendor === "amplitude"
			? {
					amplitude: {
						apiKey: import.meta.env.AMPLITUDE_API_KEY,
					},
				}
			: {}),
		...(config.analytics.vendor === "matomo"
			? {
					matomo: {
						id: import.meta.env.MATOMO_ID,
						origin: import.meta.env.MATOMO_ORIGIN,
					},
				}
			: {}),
	};
	

	// Theme
	const { theme: defaultTheme, ...rest } = config.ui;
	const theme: Config.Final["theme"] = {
		...rest,
		default: defaultTheme as Config.Final["theme"]["default"],
		lightModeAllowed: !defaultTheme.includes("dark:only"),
		darkModeAllowed: !defaultTheme.includes("light:only"),
	};

	// Colors
	const colors: Config.Final["colors"] = config.ui?.colors;

	// Fonts
	const fonts: Config.Final["fonts"] = config.ui?.fonts;

	// Socials
	const socials: Config.Final["socials"] = createSocialsManager(config.socials);

	return {
		site,
		metadata,
		i18n,
		analytics,
		theme,
		colors,
		fonts,
		socials,
	};
}

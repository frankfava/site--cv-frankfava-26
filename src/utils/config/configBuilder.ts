/**
 * Config Utility
 */
import type { Config } from "@/types/config";

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

	return {
		site,
		i18n,
		metadata,
		theme,
		colors,
		fonts,
	};
}

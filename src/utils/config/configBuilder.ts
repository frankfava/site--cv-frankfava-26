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

	// i18N
	const i18n: Config.Final["i18n"] = config.i18n;

	return {
		site,
		i18n,
	};
}

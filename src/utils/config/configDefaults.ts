/**
 * Config Defaults
 * NOTE: Use non alias paths so it can be used in theme css generation
 */
import { defu } from "defu";
import type { Config } from "../../types/config";

/** Apply Defaults and create complete config structure from partial */
export function applyConfigDefaults(config: Config.Initial | Record<string, unknown>): Config.Complete {
	const _defaults = {
		site: {
			name: "Website",
			site: globalThis.SITE_URL,
			base: "/",
			trailingSlash: null,
			logos: {
				favicon: undefined,
				faviconSvg: undefined,
			},
		},
		i18n: {
			language: "en",
			textDirection: "ltr",
		},
	};

	const merged = defu(config ?? {}, _defaults) as Config.Complete;

	return merged;
}

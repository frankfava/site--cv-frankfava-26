/**
 * File is aliased to `site:config`
 *
 * File re-exports all types and data
 * Can be accessed via `import config from 'site:config`
 */

import { applyConfigDefaults } from "@/utils/config/configDefaults";
import { addUtils } from "@/utils/config/configBuilder";

import config from "./data/site-config.json";

export * from "./types/config";

const parsed = addUtils(applyConfigDefaults(config));

// App
export const SITE = parsed.site;
export const METADATA = parsed.metadata;
export const I18N = parsed.i18n;
// export const ANALYTICS = parsed.analytics;
export const THEME = parsed.theme;
export const COLORS = parsed.colors;
export const FONTS = parsed.fonts;
// export const FEATURES = parsed.features;

// Content
// export const ABOUT = parsed.about;
// export const SOCIALS = parsed.socials;

export default {
	SITE,
	METADATA,
	I18N,
	// ANALYTICS,
	THEME,
	COLORS,
	FONTS,
	// FEATURES,
	// ABOUT,
	// SOCIALS,
};

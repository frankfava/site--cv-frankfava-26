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
export const I18N = parsed.i18n;

export default {
	SITE,
	I18N,
};

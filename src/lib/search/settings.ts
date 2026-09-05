/**
 * Resolve the settings one search dialog runs with.
 *
 * Two layers. `FEATURES.search` in `src/data/site-config.json` sets the site
 * default; a search index overrides any of it in `src/data/search`. `hotkey` is
 * the exception - it is read from the site config only, so the combo is the
 * same on every page whichever index that page queries.
 *
 * Everything comes back defined, so no caller has a fallback of its own.
 */

import { FEATURES } from "site:config";
import type { SearchIndexEntry } from "./types";

export type SearchSettings = typeof FEATURES.search;

export function resolveSearchSettings(index?: SearchIndexEntry): SearchSettings {
	const { enabled, placeholder, emptyMessage, showSocials } = index ?? {};

	return {
		...FEATURES.search,
		...(enabled !== undefined && { enabled }),
		...(placeholder !== undefined && { placeholder }),
		...(emptyMessage !== undefined && { emptyMessage }),
		...(showSocials !== undefined && { showSocials }),
	};
}

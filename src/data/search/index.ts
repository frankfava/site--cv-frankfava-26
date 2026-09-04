/**
 * Catalog of every search index.
 *
 * An index is a scope, which can be applied to multiple pages via
 * its blueprint's `config.search` property.
 *
 * An "Atomic" is a row in the search index. It is a single item that
 * is searched and displayed. You define an atomic by providing a
 * function that builds the row, defined in `src/data/search/builders.ts`.
 *
 * Define atomics below by setting the `atomics` property to an object with the
 * atomic kind as the key and the anchor as the value. The anchor is the id of the
 * section that the atomic will be added to. The section is defined in the blueprint,
 * normally from the _sectionRegistry.ts file.
 */

import type { SearchIndexEntry } from "@/lib/search";

/** The content pages, searched as one. */
export const site: SearchIndexEntry = {
	slug: "site",
	atomics: {
		skill: "skills",
		project: "projects",
		role: "history",
		certification: "certifications",
		language: "languages",
		transferable: "transferable-skills",
	},
	placeholder: "Search skills, projects, roles…",
	emptyMessage: "Start typing to search.",
	showSocials: true,
};

export const searchIndicies: Record<string, SearchIndexEntry> = { site };

export const searchIndexSlugs: string[] = Object.keys(searchIndicies);

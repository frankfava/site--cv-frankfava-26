/**
 * Catalog of every search index.
 *
 * An index is a scope rather than a page. It states where its atomic rows land
 * and what its dialog says; the pages it covers are the blueprints that name it
 * in their own `config.search`, so a page's search is switched on and off where
 * the rest of that page's chrome is declared.
 */

import type { SearchIndexEntry } from "@/lib/search";

/** The content pages, searched as one. */
export const site: SearchIndexEntry = {
	slug: "site",
	// One anchor per kind, naming no page. The build resolves each against the
	// pages this index covers and fails on anything but a single match, so a
	// section that is renamed, dropped or repeated is caught rather than shipped
	// as a link that lands in the wrong place.
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

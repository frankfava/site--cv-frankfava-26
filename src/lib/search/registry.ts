/**
 * Reading the blueprint catalog against the search catalog.
 *
 * A blueprint names the index its page queries, in `config.search.index`. An
 * index names no pages back, so which pages an index covers is answered by
 * reading the blueprints in `src/data/blueprints/index.ts`.
 */

import type { BlueprintEntry } from "@/lib/blueprints";
import { resolveSearchSettings } from "./settings";
import type { SearchIndexEntry } from "./types";

/** Check the given blueprint queries a valid index, and that search is enabled. */
export function searchIndexFor(indicies: Record<string, SearchIndexEntry>, entry?: BlueprintEntry): SearchIndexEntry | undefined {
	const search = entry?.config?.search;
	if (!search?.index || search.enabled === false) return undefined;

	const index = indicies[search.index];
	if (!index) throw new Error(`[search] blueprint "${entry?.slug}" names index "${search.index}", which is not registered`);

	return resolveSearchSettings(index).enabled ? index : undefined;
}

/** Get every blueprint an index covers, in catalog order. */
export function blueprintsInIndex(blueprints: BlueprintEntry[], indicies: Record<string, SearchIndexEntry>, slug: string): BlueprintEntry[] {
	return blueprints.filter((entry) => searchIndexFor(indicies, entry)?.slug === slug);
}

/**
 * Reading the two registries against each other.
 *
 * A blueprint names the index its page queries; an index names nothing back. So
 * every question about coverage is answered by reading the blueprints, and the
 * two catalogs never have to agree with each other.
 */

import type { BlueprintEntry } from "@/lib/blueprints";
import type { SearchIndexEntry } from "./types";

/** The index a page queries, or nothing where the page carries no search. */
export function searchIndexFor(indicies: Record<string, SearchIndexEntry>, entry?: BlueprintEntry): SearchIndexEntry | undefined {
	const search = entry?.config?.search;
	if (!search?.index || search.enabled === false) return undefined;

	const index = indicies[search.index];
	if (!index) throw new Error(`[search] blueprint "${entry?.slug}" names index "${search.index}", which is not registered`);
	return index;
}

/** Every page an index covers, in catalog order. */
export function pagesInIndex(blueprints: BlueprintEntry[], indicies: Record<string, SearchIndexEntry>, slug: string): BlueprintEntry[] {
	return blueprints.filter((entry) => searchIndexFor(indicies, entry)?.slug === slug);
}

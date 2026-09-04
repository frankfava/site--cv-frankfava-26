/**
 * One home for search: the shapes an index is stated in, and the reading of it.
 *
 * The builders that source rows from collections are imported directly by the
 * endpoint - they reach `astro:content`, and nothing on the client may.
 */

export type { AtomicKind, SearchIndexEntry, SearchItem, SearchItemKind } from "./types";
export { pagesInIndex, searchIndexFor } from "./registry";

/**
 * One home for search: the shapes an index is stated in, and the reading of it.
 *
 * What the rows are made of is authored in `@/data/search` and handed to
 * `buildSearchIndex`, so nothing here reaches a collection.
 */

export type { AtomicBuilder, AtomicKind, AtomicTarget, IconRenderer, RowDescription, SearchIndexEntry, SearchItem, SearchItemKind } from "./types";
export { pagesInIndex, searchIndexFor } from "./registry";
export { buildRows, FALLBACK_ICON } from "./rows";

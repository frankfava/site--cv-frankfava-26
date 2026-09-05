/**
 * Everything the search engine exposes: the shapes, the catalog lookups and the
 * row builder.
 *
 * What a row contains is authored in `src/data/search/builders.ts` and handed to
 * `buildSearchIndex`, so nothing here reads a collection.
 */

export type { AtomicBuilder, AtomicKind, AtomicTarget, IconRenderer, RowContext, RowDescription, SearchIndexEntry, SearchItem, SearchItemKind } from "./types";
export { blueprintsInIndex, searchIndexFor } from "./registry";
export { buildRows } from "./rows";

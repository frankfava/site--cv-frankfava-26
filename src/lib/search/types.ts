/**
 * Every shape the search system is stated in.
 *
 * These types import nothing, so the client-side dialog can use `SearchItem`
 * without pulling in anything that reads a collection.
 *
 * The engine that builds an index from them is in `src/lib/search/build.ts`.
 * The indexes themselves are defined in `src/data/search/index.ts`.
 */

/** Every kind of row an index can hold. */
export type SearchItemKind = "section" | "skill" | "project" | "role" | "certification" | "language" | "transferable" | "social";

/**
 * The kinds sourced from a collection and landed on a section anchor.
 *
 * `section` is excluded because those rows come from walking the blueprints.
 * `social` is excluded because those rows link off-site and have no anchor.
 */
export type AtomicKind = Exclude<SearchItemKind, "section" | "social">;

/** One row of a built index, as the dialog receives it. */
export interface SearchItem {
	/** Unique within the index. Written as `kind:id`. */
	id: string;
	/** Where the row navigates: a page path with an anchor, or an off-site href. */
	url: string;
	title: string;
	description: string;
	/** Pre-rendered SVG markup, or "" where no icon resolved. */
	iconHtml: string;
	/** Title of the section the row sits in. Empty for a top-level section. */
	module: string;
	/** Title of the page the row is on. An index spans pages, so each row names its own. */
	page: string;
	/** The text a query is matched against. */
	body: string;
	kind: SearchItemKind;
	/** True for a section that wraps other sections. The dialog italicises these. */
	isGroup: boolean;
}

/**
 * One search index.
 *
 * An index is a scope, not a page. Define one in `src/data/search/index.ts`,
 * then apply it to a page by naming its slug in that page's blueprint
 * `config.search.index`.
 */
export interface SearchIndexEntry {
	slug: string;
	/**
	 * The atomics this index holds, keyed by kind with the anchor as the value.
	 * A kind left out is not indexed. The anchor names no page: the build
	 * resolves it against the pages this index covers and fails on anything but
	 * a single match.
	 */
	atomics?: Partial<Record<AtomicKind, string>>;
	placeholder?: string;
	emptyMessage?: string;
	/** Whether the social links are indexed, and shown while the query is empty. */
	showSocials?: boolean;
}

/** Render an icon name to SVG markup. Returns "" if the name will not resolve, or exceeds the size budget. */
export type IconRenderer = (name: string) => Promise<string>;

/**
 * Where every row of one kind lands, resolved once per build.
 *
 * The index names only a section id. The build finds the single page it covers
 * that renders that section, and produces this:
 *
 *   atomics: { role: "history" }  →  { url: "/experience#history",
 *                                      module: "The timeline",
 *                                      page: "Experience" }
 *
 * `module` and `page` are shown beneath a row's title, which is how two rows of
 * different kinds with the same name are told apart: the "Laravel" skill on
 * Work against the "Laravel" certification on Credentials.
 */
export interface AtomicTarget {
	/** The page's path and the section's anchor, together. */
	url: string;
	/** The section's short name. */
	module: string;
	/** The page's title. */
	page: string;
}

/**
 * What a builder returns for one item.
 *
 * Only what the item knows about itself. Its kind, its icon fallback and where
 * it links are supplied separately, in `RowContext`.
 */
export interface RowDescription {
	/** Unique within the kind. The kind is prefixed when the row is built. */
	id: string;
	title: string;
	/** Shown beneath the title, after the page and section. */
	description?: string;
	/** An iconify name. `RowContext.fallbackIcon` is used when this is absent or will not resolve. */
	icon?: string;
	/** Everything a query should match on. Empty entries are dropped. */
	body: (string | undefined)[];
}

/**
 * What every row of one kind shares.
 *
 * Passed to `buildRows` alongside the list and the describe function.
 */
export interface RowContext {
	kind: SearchItemKind;
	/** Used where an item has no icon of its own, or one that will not resolve. */
	fallbackIcon: string;
	target: AtomicTarget;
	renderIcon: IconRenderer;
}

/**
 * Build every row of one atomic kind.
 *
 * Define one per kind in `src/data/search/builders.ts` and register it in
 * `ATOMIC_BUILDERS`.
 */
export type AtomicBuilder = (renderIcon: IconRenderer, target: AtomicTarget) => Promise<SearchItem[]>;

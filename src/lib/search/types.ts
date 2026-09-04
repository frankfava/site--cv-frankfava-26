/**
 * The shapes a search index is stated in.
 *
 * They reference nothing, so the dialog script can import a row's shape without
 * pulling in anything that reads a collection.
 */

/** Every row kind an index can hold. */
export type SearchItemKind = "section" | "skill" | "project" | "role" | "certification" | "language" | "transferable" | "social";

/**
 * The kinds sourced from a collection and landed on a section anchor.
 *
 * `section` is not one of them - those come from walking the blueprints
 * themselves. Neither is `social`, which navigates off-site and so has no
 * anchor to land on.
 */
export type AtomicKind = Exclude<SearchItemKind, "section" | "social">;

/** One row of a built index. */
export interface SearchItem {
	/** Unique within the index: `kind:id` for an atomic, `page:section` for a section. */
	id: string;
	/** Where the row goes: a page path with an anchor, or an off-site href. */
	url: string;
	title: string;
	description: string;
	/** Pre-rendered markup, or "" where the row has no icon. */
	iconHtml: string;
	/** The title of the section the row sits under. */
	module: string;
	/** The title of the page the row is on. An index spans pages, so a row names its own. */
	page: string;
	/** What a query is matched against. */
	body: string;
	kind: SearchItemKind;
	/** A section that wraps others, so the dialog can mark it a landing rather than a leaf. */
	isGroup: boolean;
}

/**
 * A search index: a scope, not a page.
 *
 * It names the anchors its atomic rows land on and the copy its dialog shows.
 * The pages it covers are the blueprints that name it in their own
 * `config.search`, so membership is stated once, on the page it applies to.
 */
export interface SearchIndexEntry {
	slug: string;
	/**
	 * Kind → the id of the section it lands on. An atomic kind left out is not
	 * indexed. The anchor names no page: the build resolves it against the pages
	 * this index covers and fails on anything but a single match.
	 */
	atomics?: Partial<Record<AtomicKind, string>>;
	placeholder?: string;
	emptyMessage?: string;
	/** Whether the social links are indexed, and shown while the query is empty. */
	showSocials?: boolean;
}

/** Resolves an icon name to markup, or "" for a name that will not draw or costs too much. */
export type IconRenderer = (name: string) => Promise<string>;

/**
 * Where every row of one kind lands.
 *
 * Resolved once per build, and identical for every row of that kind. The index
 * names a section id and nothing else; the build finds the single page it
 * covers that renders that section, and this is the answer:
 *
 *   atomics: { role: "history" }  →  { url: "/experience#history",
 *                                      module: "The timeline",
 *                                      page: "Experience" }
 *
 * `module` and `page` are what a row reads beneath its title, which is how two
 * things of different kinds with the same name are told apart - the "Laravel"
 * skill on Work against the "Laravel" certification on Credentials.
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
 * What a builder says about one thing.
 *
 * Only what the thing knows about itself. Where it goes, what kind it is and
 * what it falls back to for an icon are all known already.
 */
export interface RowDescription {
	/** Unique within the kind. The kind is prefixed on the way out. */
	id: string;
	title: string;
	/** The tail of the line beneath the title, after the breadcrumb. */
	description?: string;
	/** An iconify name. The kind's glyph stands in when it is absent or too costly to ship. */
	icon?: string;
	/** Everything a query should match on. Empty parts are dropped. */
	body: (string | undefined)[];
}

/** Sources every row of one atomic kind, all landing on the same target. */
export type AtomicBuilder = (renderIcon: IconRenderer, target: AtomicTarget) => Promise<SearchItem[]>;

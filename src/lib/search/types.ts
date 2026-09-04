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

/** Where an atomic kind lands, resolved from the index's anchor. */
export interface AtomicTarget {
	/** The full href: page path and anchor together. */
	url: string;
	/** The short name of the section landed on. */
	module: string;
	/** The title of the page landed on. */
	page: string;
}

/** Sources every row of one atomic kind, all landing on the same target. */
export type AtomicBuilder = (renderIcon: IconRenderer, target: AtomicTarget) => Promise<SearchItem[]>;

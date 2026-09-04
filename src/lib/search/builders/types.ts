import type { SearchItem } from "../types";

/** Resolves an icon name to markup, or "" where the name will not render. */
export type IconRenderer = (name: string) => Promise<string>;

/** Where an atomic kind lands, resolved from the index's anchor. */
export interface AtomicTarget {
	/** The full href, page path and anchor together. */
	url: string;
	/** The title of the section landed on. */
	module: string;
	/** The title of the page landed on. */
	page: string;
}

export type AtomicBuilder = (renderIcon: IconRenderer, target: AtomicTarget) => Promise<SearchItem[]>;

/**
 * Shapes a catalog entry conforms to. Kept apart from the registry so a
 * blueprint file can type its own `entry` without importing the registry that
 * imports it back.
 */

import type { BlueprintBuilder, BlueprintPartBuilder } from "./builder";
import type { BlueprintSchema } from "./schema";

/**
 * Cross-cutting metadata that lives next to the catalog entry, not the
 * structure. The blueprint `BlueprintBuilder` only cares about structure;
 * search scoping and layout chrome belong here.
 */
export interface BlueprintConfig {
	/**
	 * Which search index this page's dialog queries, and whether it carries one
	 * at all. Named rather than imported, so the search catalog stays free to
	 * read the blueprints without either one importing the other.
	 */
	search?: {
		/** Off on this page even where an index is named. */
		enabled?: boolean;
		/** A slug from the search catalog. A page naming none carries no search. */
		index?: string;
	};
	/**
	 * Per-blueprint chrome (sidebar / footer visibility, etc.) consumed by
	 * `BlueprintLayout`. Page-level props at the call-site override these - the
	 * blueprint just declares the *default* chrome for any page that renders it.
	 */
	layout?: {
		showSidebar?: boolean;
		showFooter?: boolean;
		/**
		 * Whether the index bay starts collapsed on this page. A page whose index
		 * is two entries long is paying 344px for them, which the content can
		 * usually put to better use. Only a default: a visitor who has toggled the
		 * bay keeps their choice.
		 */
		bay?: "open" | "closed";
		/**
		 * Move the hero inside the content column, so the sidebar is full height
		 * from the first paint instead of starting below the hero.
		 */
		fullHeight?: boolean;
	};
}

/** Shape every catalog entry conforms to, regardless of source or medium. */
export type BlueprintPartEntry = {
	blueprint: BlueprintPartBuilder<BlueprintSchema<unknown>>;
};

export type BlueprintPartEntryPartial = Omit<BlueprintPartEntry, "blueprint"> & {
	blueprint: BlueprintPartBuilder<BlueprintSchema<unknown>> | BlueprintSchema<unknown>;
};

/** A catalog entry for the screen, which carries the chrome its page is built from. */
export type BlueprintEntry = Omit<BlueprintPartEntry, "blueprint"> & {
	slug: string;
	title: string;
	blueprint: BlueprintBuilder<BlueprintSchema<unknown>>;
	/** The route this blueprint is rendered at. Defaults to the slug. */
	path?: string;
	/** Narrative blurb used for `<head>` metadata. */
	description?: string;
	/** Page-shell config (search, layout). Optional. */
	config?: BlueprintConfig;
};

export type BlueprintEntryPartial = Omit<BlueprintEntry, "blueprint" | "slug"> & {
	slug?: string;
	blueprint: BlueprintBuilder<BlueprintSchema<unknown>> | BlueprintSchema<unknown>;
};

/**
 * Shapes a catalog entry conforms to. Kept apart from the registry so a
 * blueprint file can type its own `entry` without importing the registry that
 * imports it back.
 */

import type { BlueprintBuilder } from "./builder";
import type { BlueprintSchema } from "./schema";

/**
 * Cross-cutting metadata that lives next to the catalog entry, not the
 * structure. The blueprint `BlueprintBuilder` only cares about structure;
 * search scoping and layout chrome belong here.
 */
export interface BlueprintConfig {
	/**
	 * Per-blueprint chrome (sidebar / footer visibility, etc.) consumed by
	 * `BlueprintLayout`. Page-level props at the call-site override these - the
	 * blueprint just declares the *default* chrome for any page that renders it.
	 */
	layout?: {
		showSidebar?: boolean;
		showFooter?: boolean;
		/**
		 * Width of the reading column, for pages rendered by `RedesignLayout`.
		 * Any CSS length. Prose wants a shorter measure than a filterable grid
		 * does, so it is per-page rather than one number for the whole site.
		 * Defaults to 1120px.
		 */
		contentWidth?: string;
		/**
		 * Whether the index bay starts collapsed on this page. A page whose index
		 * is two entries long is paying 344px for them, which the content can
		 * usually put to better use. Only a default: a visitor who has toggled the
		 * bay keeps their choice.
		 */
		bay?: "open" | "closed";
	};
}

/** Shape every catalog entry conforms to, regardless of source. */
export type BlueprintEntry = {
	slug: string;
	title: string;
	blueprint: BlueprintBuilder<BlueprintSchema>;
	/** Narrative blurb used for `<head>` metadata. */
	description?: string;
	/** Page-shell config (search, layout). Optional. */
	config?: BlueprintConfig;
};

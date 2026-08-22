import type { App } from "site:config";

/** Used for Passing Meta to Layout for meta tags/SEO */
export interface MetaData {
	/** Page Title */
	title?: string;
	/** Ignore Template */
	ignoreTitleTemplate?: boolean;
	/** Canonical URL for this page */
	canonical?: string;
	/** Index and Follow */
	robots?: App.MetaData.Robots;
	/** Meta Description */
	description?: string;
	/** Open Graph */
	openGraph?: App.MetaData.OpenGraph;
	/** Twitter Meta */
	twitter?: App.MetaData.Twitter;
	/** Author */
	author?: string;
}
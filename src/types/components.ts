import type { HTMLAttributes } from "astro/types";
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

export interface Link extends Omit<HTMLAttributes<"a">, "slot"> {
	text?: string;
	ariaLabel?: string;
	icon?: string;
	showOn?: string | string[];
}

/** CTA */
export interface _CallToAction extends Omit<HTMLAttributes<"a">, "slot"> {
	variant?: "primary" | "primaryOutline" | "secondary" | "secondaryOutline" | "accent" | "accentOutline" | "tertiary" | "link";
	text?: string;
	icon?: string;
	classes?: Record<string, string>;
	type?: "button" | "submit" | "reset";
}

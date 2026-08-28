import type { HTMLAttributes } from "astro/types";
import type { App } from "site:config";
import type { _ModuleWrapper } from "@/components/ui/modules/ModuleWrapper.astro";

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
}

// ==== Components

/** Base Module */
export interface _Module {
	id?: string;
	// Falls back to the page's `layout.contentWidth`
	contentWidth?: string;
	isDark?: boolean;
	bg?: string;
	classes?: Record<PropertyKey, string | Record<PropertyKey, string>>;
}

/** Module Header */
export interface _ModuleHeader {
	title?: string;
	subtitle?: string;
	classes?: Record<string, string>;
	headerAlign?: "left" | "center" | "right";
	stacked?: boolean;
	cta?: _CallToAction;
}

/** CTA */
export interface _CallToAction extends Omit<HTMLAttributes<"a">, "slot"> {
	variant?: "primary" | "primaryOutline" | "secondary" | "secondaryOutline" | "accent" | "accentOutline" | "tertiary" | "link";
	text?: string;
	icon?: string;
	classes?: Record<string, string>;
	type?: "button" | "submit" | "reset";
}

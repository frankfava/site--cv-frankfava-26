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
}

// ==== Components

/** Base Module */
export interface _Module {
	id?: string;
	isDark?: boolean;
	bg?: string;
	classes?: Partial<Record<"wrapper" | "container" | "content" | "body", HTMLAttributes<any>["class:list"]>>;
}

/** Module Header */
export interface _ModuleHeader {
	title?: string;
	subtitle?: string;
	classes?: Partial<Record<"container" | "title" | "subtitle" | "cta" | "ctaBtn" | string, HTMLAttributes<any>["class:list"]>>;
	headerAlign?: "left" | "center" | "right";
	stacked?: boolean;
	cta?: _CallToAction;
}

/** CTA */
export interface _CallToAction extends Omit<HTMLAttributes<"a">, "slot"> {
	variant?: "primary" | "primaryOutline" | "secondary" | "secondaryOutline" | "accent" | "accentOutline" | "tertiary" | "link";
	text?: string;
	icon?: string;
	classes?: Partial<Record<"outer" | "text" | "icon", HTMLAttributes<any>["class:list"]>>;
	type?: "button" | "submit" | "reset";
}

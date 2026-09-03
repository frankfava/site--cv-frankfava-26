/**
 * The class-independent half of the blueprint manager.
 *
 * These declarations describe a blueprint's *data* and reference nothing but
 * each other, so a consumer that only needs the shapes does not have to pull in
 * the builder. The proxy types stay with the classes: they are defined in terms
 * of them, and moving them here would only reverse the dependency.
 */

import type { _ModuleWrapper } from "@/components/ui/modules/ModuleWrapper.astro";

/** Where a part's body comes from: rendered markup, or a component to load. */
export type PartContent = string | (() => Promise<object>);

/**
 * A section, in the terms every medium shares: what it is called, what it says,
 * and what it renders.
 *
 * The content parameter is what a medium that nests widens. A part on its own
 * is a leaf, which is why paper needs nothing beyond this.
 */
export interface BlueprintPart<C = PartContent> {
	id?: string;
	title: string;
	description?: string;
	eyebrow?: string;
	content: C;
	hidden?: boolean;
}

/** A blueprint stated in parts. */
export type BlueprintSchema<C = PartContent> = Record<string, BlueprintPart<C>>;

/**
 * A part on an indexed screen page. Everything it adds is chrome the page is
 * navigated by, which is why it stops at the edge of the browser.
 */
export interface BlueprintComponent extends Omit<BlueprintPart<unknown>, "content"> {
	icon: string;
	content: Record<string, Omit<BlueprintComponent, "hidden">> | PartContent;
	mainMenuLabel?: string;
	showInSidebar?: boolean;
	href?: string;
	props?: _ModuleWrapper;
}

/** A screen part's body: a leaf, or the sections nested under it. */
export type ComponentContent = BlueprintComponent["content"];

/** The schema of a blueprint built for the screen. */
export type BlueprintComponentSchema = Record<string, BlueprintComponent>;

/** What a screen section holds once built: a part, plus the chrome it was given. */
export type SectionData = BlueprintPart<ComponentContent> & Partial<Omit<BlueprintComponent, keyof BlueprintPart>>;

/** Blueprint for display */
export type AssembledBlueprint = AssembledSection[];

/** Section ready for display */
export interface AssembledSection extends _ModuleWrapper {
	id: string;
	icon: string;
	content: PartContent;
	hidden: boolean;
	sections: AssembledBlueprint;
}

/** Utility to get all section keys */
export type NestedKeys<T extends BlueprintSchema<unknown>> =
	| keyof T
	| {
			[K in keyof T]: T[K]["content"] extends BlueprintSchema<unknown> ? keyof T[K]["content"] : never;
	  }[keyof T];

/**
 * The class-independent half of the blueprint manager.
 *
 * These four declarations describe a blueprint's *data* and reference nothing
 * but each other, so a consumer that only needs the shapes does not have to
 * pull in the builder. The proxy types stay with the classes: they are defined
 * in terms of them, and moving them here would only reverse the dependency.
 */

import type { _ModuleWrapper } from "@/components/ui/modules/ModuleWrapper.astro";

/** Blueprint schema definition */
export type BlueprintSchema = Record<string, BlueprintComponent>;

/** Blueprint part definition */
export interface BlueprintComponent {
	id?: string;
	title: string;
	description?: string;
	eyebrow?: string;
	icon: string;
	content: Record<string, Omit<BlueprintComponent, "hidden">> | string | (() => Promise<object>);
	mainMenuLabel?: string;
	showInSidebar?: boolean;
	href?: string;
	hidden?: boolean;
	props?: _ModuleWrapper;
}

/** Blueprint for display */
export type AssembledBlueprint = AssembledSection[];

/** Section ready for display */
export interface AssembledSection extends _ModuleWrapper {
	id: string;
	icon: string;
	content: string | (() => Promise<object>);
	hidden: boolean;
	sections: AssembledBlueprint;
}

/** Utility to get all section keys */
export type NestedKeys<T extends BlueprintSchema> =
	| keyof T
	| {
			[K in keyof T]: T[K]["content"] extends BlueprintSchema ? keyof T[K]["content"] : never;
	  }[keyof T];

/**
 * One home for the blueprint machinery: the shapes, the engine that assembles
 * them, and the page-shell config they carry.
 *
 * `schema` and `builder` are separate because the engine's two classes call
 * each other and must stay together, while the data shapes reference nothing -
 * so a consumer that only needs a shape does not load the engine.
 */

export type {
	AssembledBlueprint,
	AssembledPart,
	AssembledSection,
	AssembledParts,
	BlueprintComponent,
	BlueprintComponentSchema,
	BlueprintPart,
	BlueprintSchema,
	NestedKeys,
	PartContent,
	SectionData,
} from "./schema";
export { BlueprintBuilder, BlueprintPartBuilder, BlueprintPartSection, BlueprintSection, buildBlueprint, buildBlueprintEntry, buildPartEntry, buildParts } from "./builder";
export type { BlueprintPartProxy, ParsedBlueprint } from "./builder";
export type { BlueprintConfig, BlueprintEntry, BlueprintPartEntry } from "./types";
export { isAsyncLoader, isComponent, isVisible, loadPart, partComponent } from "./content";
export type { PartModule } from "./content";

/**
 * One home for the blueprint machinery: the shapes, the engine that assembles
 * them, and the page-shell config they carry.
 *
 * `schema` and `builder` are separate because the engine's two classes call
 * each other and must stay together, while the data shapes reference nothing -
 * so a consumer that only needs a shape does not load the engine.
 */

export type { AssembledBlueprint, AssembledSection, BlueprintComponent, BlueprintSchema, NestedKeys } from "./schema";
export { BlueprintBuilder, BlueprintSection, buildBlueprint, buildBlueprintEntry } from "./builder";
export type { ParsedBlueprint } from "./builder";
export type { BlueprintConfig, BlueprintEntry } from "./types";

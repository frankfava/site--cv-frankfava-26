/**
 * One home for blueprints: the shapes, the engine that assembles them, the
 * catalog of registered ones, and the search-feature merge that reads it.
 *
 * `schema` and `builder` are separate because the engine's two classes call
 * each other and must stay together, while the data shapes reference nothing -
 * so a consumer that only needs a shape does not load the engine.
 */

export type { AssembledBlueprint, AssembledSection, BlueprintComponent, BlueprintSchema, NestedKeys } from "./schema";
export { BlueprintBuilder, BlueprintSection, buildBlueprint, buildBlueprintEntry } from "./builder";
export type { ParsedBlueprint } from "./builder";
export type { BlueprintConfig, BlueprintEntry } from "./types";
export { blueprints, blueprintSlugs } from "@/data/blueprints";

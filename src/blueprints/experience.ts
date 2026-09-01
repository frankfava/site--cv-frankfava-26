import { buildBlueprint, type BlueprintSchema } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import { history, achievements, fullRecord } from "./_sectionRegistry";

export const structure = { history, achievements, fullRecord } as const satisfies BlueprintSchema;

export const blueprint = buildBlueprint(structure);

export const entry: BlueprintEntry = {
	slug: "experience",
	title: "Experience",
	blueprint,
	description: "The full timeline, every role, and the achievements attached to each of them.",
	config: {
		// search: {
		// 	atomics: { role: "history" },
		// },
	},
};

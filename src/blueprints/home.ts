import { buildBlueprint, type BlueprintSchema } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import { capability, trackRecord, stillRunning, yourProblem, beforeWeTalk, roleDossiers, fullRecord } from "./_sectionRegistry";

export const structure = {
	capability,
	trackRecord,
	stillRunning,
	yourProblem,
	beforeWeTalk,
	roleDossiers,
	fullRecord,
} as const satisfies BlueprintSchema;

export const blueprint = buildBlueprint(structure);

export const entry: BlueprintEntry = {
	slug: "home",
	title: "Frank Fava CV",
	blueprint,
	description: "The bridge between the customer and the system. Eighteen years of winning the work, designing it, building it, and still being the call when it breaks.",
	config: {
		// search: {
		// 	atomics: {
		//		project: "still-running",
		//		role: "track-record",
		// 	},
		// },
		// layout: { showSidebar: false },
	},
};

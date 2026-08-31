import { buildBlueprint, type BlueprintSchema } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";

/**
 * The home page.
 */
export const structure = {
	capability: {
		id: "capability",
		title: "Set what your role needs, and I'll show you where I sit",
		mainMenuLabel: "Capability check",
		icon: "ph:sliders-horizontal-duotone",
		description: "Every role calls this job something different, so rather than make you pick a title, set what you actually need. The dial on the left keeps your reading as you scroll.",
		content: async () => import("@/components/blueprints/home/Capability.astro"),
	},
	trackRecord: {
		id: "track-record",
		title: "Eighteen years, described by the shape of the work rather than the titles",
		mainMenuLabel: "Track record",
		icon: "ph:chart-line-up-duotone",
		description: "Nine roles across two continents, with one thread running through them: I am usually both the person the customer talks to and the person who builds it.",
		content: async () => import("@/components/blueprints/home/TrackRecord.astro"),
	},
} as const satisfies BlueprintSchema;

export const blueprint = buildBlueprint(structure);

export const entry: BlueprintEntry = {
	slug: "home",
	title: "Frank Fava CV",
	blueprint,
	description: "The bridge between the customer and the system. Eighteen years of winning the work, designing it, building it, and still being the call when it breaks.",
	config: {
		// search: {
		// },
		// layout: { showSidebar: false },
	},
};

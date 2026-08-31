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
		content: async () => import("@/components/blueprints/shared/Capability.astro"),
	},
	trackRecord: {
		id: "track-record",
		title: "Eighteen years, described by the shape of the work rather than the titles",
		mainMenuLabel: "Track record",
		icon: "ph:chart-line-up-duotone",
		description: "Nine roles across two continents, with one thread running through them: I am usually both the person the customer talks to and the person who builds it.",
		content: async () => import("@/components/blueprints/shared/TrackRecord.astro"),
	},
	beforeWeTalk: {
		id: "before-we-talk",
		title: "Two things end it. Everything else has an answer.",
		mainMenuLabel: "Before we talk",
		icon: "ph:warning-diamond-duotone",
		description: "I would rather a real constraint ended this now than in week three.",
		content: async () => import("@/components/blueprints/shared/Signals.astro"),
	},
	fullRecord: {
		id: "full-record",
		title: "The full record, one page at a time",
		mainMenuLabel: "The full record",
		icon: "ph:books-duotone",
		description: "Nothing has been cut, it's just no longer in your way.",
		content: async () => import("@/components/blueprints/shared/FullRecord.astro"),
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
		// 	atomics: {
		//		role: "track-record",
		// 	},
		// },
		// layout: { showSidebar: false },
	},
};

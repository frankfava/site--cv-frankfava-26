import { buildBlueprint, type BlueprintSchema } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";

/**
 * The experience page.
 */
export const structure = {
	history: {
		id: "history",
		eyebrow: "Every role",
		title: "Nine roles, two continents, one thread",
		mainMenuLabel: "The timeline",
		icon: "ph:clock-countdown-fill",
		description: "In full, most recent first. The short version of the same thing is the chart on the front page.",
		content: async () => import("@/components/blueprints/shared/History.astro"),
	},
	achievements: {
		id: "achievements",
		eyebrow: "What came of it",
		title: "What came of each of them",
		mainMenuLabel: "Achievements",
		icon: "ph:trophy-duotone",
		description: "Grouped by the company they belong to, so a claim always has a place attached to it.",
		content: async () => import("@/components/blueprints/shared/Achievements.astro"),
	},
	fullRecord: {
		id: "full-record",
		title: "The full record, one page at a time",
		mainMenuLabel: "The full record",
		eyebrow: "Go deeper",
		icon: "ph:books-duotone",
		description: "Nothing has been cut, it's just no longer in your way.",
		content: async () => import("@/components/blueprints/shared/FullRecord.astro"),
	},
} as const satisfies BlueprintSchema;

export const blueprint = buildBlueprint(structure);

export const entry: BlueprintEntry = {
	slug: "experience",
	title: "Experience",
	blueprint,
	description: "The full timeline, every role, and the achievements attached to each of them.",
	config: {
		// search: {
		// 	atomics: {
		// 		role: "history",
		// 	},
		// },
	},
};

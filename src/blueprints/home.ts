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
		eyebrow: "Capability",
		icon: "ph:sliders-horizontal-duotone",
		description: "Every role calls this job something different, so rather than make you pick a title, set what you actually need. The dial on the left keeps your reading as you scroll.",
		content: async () => import("@/components/blueprints/shared/Capability.astro"),
	},
	trackRecord: {
		id: "track-record",
		title: "Eighteen years, described by the shape of the work rather than the titles",
		mainMenuLabel: "Track record",
		eyebrow: "Track record",
		icon: "ph:chart-line-up-duotone",
		description: "Nine roles across two continents, with one thread running through them: I am usually both the person the customer talks to and the person who builds it.",
		content: async () => import("@/components/blueprints/shared/TrackRecord.astro"),
	},
	yourProblem: {
		id: "your-problem",
		eyebrow: "Your problem",
		title: "Tell me which of these sounds like your week",
		mainMenuLabel: "Your problem",
		icon: "ph:crosshair-duotone",
		description: "Four problems I have actually been handed. Pick the closest and I will show you how it went.",
		content: async () => import("@/components/blueprints/shared/Scenarios.astro"),
	},
	beforeWeTalk: {
		id: "before-we-talk",
		eyebrow: "Before we talk",
		title: "Two things end it. Everything else has an answer.",
		mainMenuLabel: "Before we talk",
		icon: "ph:warning-diamond-duotone",
		description: "I would rather a real constraint ended this now than in week three.",
		content: async () => import("@/components/blueprints/shared/Signals.astro"),
	},
	roleDossiers: {
		id: "role-dossiers",
		eyebrow: "Forward this",
		title: "Four versions of the same evidence, one per role",
		description: "Same evidence, reordered for the role it is aimed at, each with a one-page version you can forward.",
		mainMenuLabel: "Which version to send",
		icon: "ph:paper-plane-tilt-duotone",
		content: async () => import("@/components/blueprints/shared/RoleDoissiers.astro"),
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

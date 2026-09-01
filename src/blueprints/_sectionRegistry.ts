import { type BlueprintSchema, type BlueprintComponent } from "@/lib/blueprints";

export const capability: BlueprintComponent = {
	id: "capability",
	title: "Set what your role needs, and I'll show you where I sit",
	mainMenuLabel: "Capability check",
	eyebrow: "Capability",
	icon: "ph:sliders-horizontal-duotone",
	description: "Every role calls this job something different, so rather than make you pick a title, set what you actually need. The dial on the left keeps your reading as you scroll.",
	content: async () => import("@/components/blueprints/shared/Capability.astro"),
};

export const trackRecord: BlueprintComponent = {
	id: "track-record",
	title: "Eighteen years, described by the shape of the work rather than the titles",
	mainMenuLabel: "Track record",
	eyebrow: "Track record",
	icon: "ph:chart-line-up-duotone",
	description: "Nine roles across two continents, with one thread running through them: I am usually both the person the customer talks to and the person who builds it.",
	content: async () => import("@/components/blueprints/shared/TrackRecord.astro"),
};

export const stillRunning: BlueprintComponent = {
	id: "still-running",
	hidden: true,
	eyebrow: "What's outlived me",
	title: "The systems still running without me",
	mainMenuLabel: "What's still running",
	icon: "ph:hard-drives-duotone",
	description: "There's a real difference between work I contributed to and systems I designed, shipped and stayed accountable for.",
	content: async () => import("@/components/blueprints/shared/StillRunning.astro"),
};

export const yourProblem: BlueprintComponent = {
	id: "your-problem",
	eyebrow: "Your problem",
	title: "Tell me which of these sounds like your week",
	mainMenuLabel: "Your problem",
	icon: "ph:crosshair-duotone",
	description: "Four problems I have actually been handed. Pick the closest and I will show you how it went.",
	content: async () => import("@/components/blueprints/shared/Scenarios.astro"),
};

export const beforeWeTalk: BlueprintComponent = {
	id: "before-we-talk",
	eyebrow: "Before we talk",
	title: "Two things end it. Everything else has an answer.",
	mainMenuLabel: "Before we talk",
	icon: "ph:warning-diamond-duotone",
	description: "I would rather a real export constraint ended this now than in week three.",
	content: async () => import("@/components/blueprints/shared/Signals.astro"),
};

export const roleDossiers: BlueprintComponent = {
	id: "role-dossiers",
	eyebrow: "Forward this",
	title: "Four versions of the same evidence, one per role",
	description: "Same evidence, reordered for the role it is aimed at, each with a one-page version you can forward.",
	mainMenuLabel: "Which version to send",
	icon: "ph:paper-plane-tilt-duotone",
	content: async () => import("@/components/blueprints/shared/RoleDossiers.astro"),
};

export const history: BlueprintComponent = {
	id: "history",
	eyebrow: "Every role",
	title: "Nine roles, two continents, one thread",
	mainMenuLabel: "The timeline",
	icon: "ph:clock-countdown-fill",
	description: "In full, most recent first. The short version of the same thing is the chart on the front page.",
	content: async () => import("@/components/blueprints/shared/History.astro"),
};

export const achievements: BlueprintComponent = {
	id: "achievements",
	eyebrow: "What came of it",
	title: "What came of each of them",
	mainMenuLabel: "Achievements",
	icon: "ph:trophy-duotone",
	description: "Grouped by the company they belong to, so a claim always has a place attached to it.",
	content: async () => import("@/components/blueprints/shared/Achievements.astro"),
};

export const fullRecord: BlueprintComponent = {
	id: "full-record",
	title: "The full record, one page at a time",
	mainMenuLabel: "The full record",
	eyebrow: "Go deeper",
	icon: "ph:books-duotone",
	description: "Nothing has been cut, it's just no longer in your way.",
	content: async () => import("@/components/blueprints/shared/FullRecord.astro"),
};

export default {
	capability,
	trackRecord,
	stillRunning,
	yourProblem,
	beforeWeTalk,
	roleDossiers,
	history,
	achievements,
	fullRecord,
} as const satisfies BlueprintSchema;

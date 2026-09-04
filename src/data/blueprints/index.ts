/**
 * Catalog of every page-driving blueprint.
 *
 * Each entry maps a stable slug → an assembled `BlueprintBuilder`, plus the
 * page-shell config that blueprint carries: the search index its dialog
 * queries, and its layout chrome. The slug is the page's route unless `path`
 * overrides it.
 *
 * Search:
 * - An entry naming no index carries no search. The indexes themselves live in
 * `@/data/search`.
 *
 * Every blueprint file exports its own `entry`.
 */

import { buildBlueprintEntry, type BlueprintEntry, type BlueprintComponentSchema } from "@/lib/blueprints";
import * as sections from "./_sectionRegistry";
import { careerYears } from "@/lib/spans";
import { inWords } from "@/utils/number";

export const home = buildBlueprintEntry({
	slug: "home",
	title: "Frank Fava CV",
	description: `The bridge between the customer and the system. ${inWords(careerYears(), "Sentence")} years of winning the work, designing it, building it, and still being the call when it breaks.`,
	blueprint: {
		capability: sections.capability,
		trackRecord: sections.trackRecord,
		roleDossiers: sections.roleDossiers,
		beforeWeTalk: sections.beforeWeTalk,
		fullRecord: sections.fullRecord,
		yourProblem: sections.yourProblem,
	} as const satisfies BlueprintComponentSchema,
	path: "/",
	config: {
		search: { index: "site" },
		// layout: { showSidebar: false },
	},
});

export const work = buildBlueprintEntry({
	slug: "work",
	title: "Work",
	description: "Every project with the technologies, the constraints and what it produced.",
	blueprint: {
		projects: sections.projects,
		stillRunning: sections.stillRunning,
		skills: sections.skills,
		references: sections.references,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintComponentSchema,
	config: {
		search: { index: "site" },
	},
});

export const ai = buildBlueprintEntry({
	slug: "ai",
	title: "AI practice",
	description: "The agentic tooling I run daily, the tools I have published, and what I actually use them for.",
	blueprint: {
		practice: sections.practice,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintComponentSchema,
	config: {
		search: { index: "site" },
	},
});

export const experience = buildBlueprintEntry({
	slug: "experience",
	title: "Experience",
	description: "The full timeline, every role, and the achievements attached to each of them.",
	blueprint: {
		history: sections.history,
		achievements: sections.achievements,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintComponentSchema,
	config: {
		search: { index: "site" },
	},
});

export const about = buildBlueprintEntry({
	slug: "about",
	title: "About me",
	description: "Who I am, how I behave under pressure, what I'm still learning, and what the personality tests make of me.",
	blueprint: {
		quickIntro: sections.quickIntro,
		self: sections.self,
		learning: sections.learning,
		personalityTests: sections.personalityTests,
		transferableSkills: sections.transferableSkills,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintComponentSchema,
	config: {
		search: { index: "site" },
	},
});

export const credentials = buildBlueprintEntry({
	slug: "credentials",
	title: "Credentials",
	description: "What I have, what I don't, and every credential linked back to the issuer.",
	blueprint: {
		education: sections.education,
		certifications: sections.certifications,
		languages: sections.languages,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintComponentSchema,
	config: {
		search: { index: "site" },
	},
});

export const blueprints: Record<string, BlueprintEntry> = {
	home,
	work,
	ai,
	experience,
	about,
	credentials,
};

export const blueprintSlugs: string[] = Object.keys(blueprints);

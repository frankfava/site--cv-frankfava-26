/**
 * Catalog of every page-driving blueprint.
 *
 * Each entry maps a stable slug → an assembled `BlueprintBuilder`, plus any
 * cross-cutting page-shell config (search scoping, layout chrome). The slug
 * is the source of truth used by:
 *   - the dynamic search-index endpoint (`/api/search-index/[blueprintSlug].json`)
 *   - `Search.astro` to fetch the right scoped index
 *   - role landing pages (which derive their slugs from `ROLES` in `@/utils/roles.ts`)
 *
 * Every blueprint file (static or role) exports its own `entry`.
 */

import { buildBlueprintEntry, type BlueprintEntry, type BlueprintSchema } from "@/lib/blueprints";
import * as sections from "./_sectionRegistry";

export const home = buildBlueprintEntry({
	slug: "home",
	title: "Frank Fava CV",
	description: "The bridge between the customer and the system. Eighteen years of winning the work, designing it, building it, and still being the call when it breaks.",
	blueprint: {
		capability: sections.capability,
		trackRecord: sections.trackRecord,
		stillRunning: sections.stillRunning,
		yourProblem: sections.yourProblem,
		beforeWeTalk: sections.beforeWeTalk,
		roleDossiers: sections.roleDossiers,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintSchema,
	config: {
		// search: {
		// 	atomics: {
		//		project: "still-running",
		//		role: "track-record",
		// 	},
		// },
		// layout: { showSidebar: false },
	},
});

export const work = buildBlueprintEntry({
	slug: "work",
	title: "Work",
	description: "Every project with the technologies, the constraints and what it produced.",
	blueprint: {
		projects: sections.projects,
		skills: sections.skills,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintSchema,
	config: {
		layout: { bay: "closed" },
		// search: {
		// 	atomics: { project: "projects", skill: "skills" },
		// },
	},
});

export const ai = buildBlueprintEntry({
	slug: "ai",
	title: "AI practice",
	description: "The agentic tooling I run daily, the tools I have published, and what I actually use them for.",
	blueprint: {
		practice: sections.practice,
		fullRecord: sections.fullRecord,
	} as const satisfies BlueprintSchema,
	config: {
		// search: {
		// 	atomics: { project: "practice"},
		// },
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
	} as const satisfies BlueprintSchema,
	config: {
		// search: {
		// 	atomics: { role: "history" },
		// },
	},
});

export const blueprints: Record<string, BlueprintEntry> = {
	home,
	work,
	ai,
	experience,
};

export const blueprintSlugs: string[] = Object.keys(blueprints);

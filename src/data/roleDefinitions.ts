import type { CertificationId, SkillId } from "content:ids";
import type { BlueprintEntry } from "@/lib/blueprints";
import { getRoleBySlug } from "@/data/roles";

import { definition as solutionsArchitect, entry as solutionsArchitectEntry } from "@/blueprints/roles/solutions-architect";
import { definition as forwardDeployedEngineer, entry as forwardDeployedEngineerEntry } from "@/blueprints/roles/forward-deployed-engineer";
import { definition as technicalEvangelist, entry as technicalEvangelistEntry } from "@/blueprints/roles/technical-evangelist";
import { definition as seniorEngineer, entry as seniorEngineerEntry } from "@/blueprints/roles/senior-engineer";
import { definition as engineeringManager, entry as engineeringManagerEntry } from "@/blueprints/roles/engineering-manager";

/** A single CV-fact → role-requirement bridge for recruiters / hiring managers. */
export interface RoleMapping {
	/** What you bring (skill, project, experience). Optional `url` may
	 *  link to an in-page anchor (`#id`), a home-page anchor, or external. */
	from: { label: string; url?: string };
	/** The role requirement / company value it satisfies. */
	to: string;
	/** Optional one-liner connecting the two. */
	note?: string;
}

/** A single pillar card on a role's pitch page (icon + title + body). */
export interface PitchPillar {
	icon: string;
	title: string;
	/** May contain inline HTML; rendered with `set:html` so `<code>` / `<a>` work. */
	body: string;
}

/** A "what translates" bullet - career-shape on the left, role-shape on the right. */
export interface PitchTranslation {
	from: string;
	to: string;
}

/** Data-driven contents for the shared `roles/_shared/Pitch.astro` renderer. */
export interface PitchContent {
	/** Optional "why this role / why now" block - renders before the lead. */
	whyNow?: {
		/** Defaults to "Why {role.title}, why now". */
		title?: string;
		/** Each rendered as a `<p>` with `set:html`. */
		paragraphs: string[];
	};
	/** Bold/larger summary line - the role-shape intersection statement. */
	lead: string;
	/** Capability cards (typically 4). */
	pillars: PitchPillar[];
	/** Optional "what translates" block - renders after the pillars. */
	whatTranslates?: {
		/** Defaults to "What translates". */
		title?: string;
		bullets: PitchTranslation[];
	};
	/** Override the "curated for X role specifically" closing line. Defaults derived from role.title. */
	curatedNote?: string;
}

/**
 * Role-specific extras layered on top of the catalog `BlueprintEntry`.
 * Identity / chrome (slug, title, description, blueprint) live on the entry;
 * everything here is recruiter-facing content unique to the role page.
 */
export interface RoleDefinition {
	enabled?: boolean;
	hidden?: boolean;
	/** The role slug. */
	slug: string;
	/** Skills to spotlight on this role page (refs into the skills collection). */
	featuredSkills?: SkillId[];
	/** Projects to spotlight on this role page (refs into the projects collection). */
	featuredProjects?: string[];
	/** Certifications to spotlight on this role page (refs into the certifications collection). */
	featuredCertifications?: CertificationId[];
	/** Transferable skills to spotlight on this role page (refs into the transferableSkills collection). */
	featuredTransferableSkills?: string[];
	featuredCaseStudies?: string[];
	/** Recruiter-facing "what I bring → what the role needs" bridges. */
	mappings?: RoleMapping[];
	/** Pitch page contents (lead + pillars + optional why-now / what-translates). Rendered by the shared Pitch.astro. */
	pitch?: PitchContent;
}

/** A role view = catalog entry merged with role-specific extras. Returned
 *  by `getRoleBySlug` / `ROLES` so consumers get one object with everything. */
export type Role = BlueprintEntry & RoleDefinition;

const DEFINITIONS: RoleDefinition[] = [engineeringManager, solutionsArchitect, forwardDeployedEngineer, seniorEngineer, technicalEvangelist];

const ENTRIES: BlueprintEntry[] = [engineeringManagerEntry, solutionsArchitectEntry, forwardDeployedEngineerEntry, seniorEngineerEntry, technicalEvangelistEntry];

const definitionsBySlug: Record<string, RoleDefinition> = Object.fromEntries(DEFINITIONS.map((d) => [d.slug, d]));
const entriesBySlug: Record<string, BlueprintEntry> = Object.fromEntries(ENTRIES.map((e) => [e.slug, e]));

/** The registry is the identity source, so its title and copy win over the page entry's. */
export function getRole(slug: string): Role | undefined {
	const identity = getRoleBySlug(slug);
	const entry = entriesBySlug[slug];
	if (!identity || !entry) return undefined;
	return { ...entry, ...definitionsBySlug[slug], ...identity };
}

import type { CertificationId, SkillId, TransferableSkillId } from "content:ids";
import { getCollection } from "astro:content";
import type { BlueprintEntry } from "@/lib/blueprints";

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
	/** Disabled means no page is built. Hidden means the page exists but nothing lists it. */
	enabled?: boolean;
	hidden?: boolean;
	/** The role slug. */
	slug: string;
	/** The one line that introduces the role wherever it is listed. */
	summary: string;
	/** Skills to spotlight on this role page (refs into the skills collection). */
	featuredSkills?: SkillId[];
	/** Projects to spotlight on this role page (refs into the projects collection). */
	featuredProjects?: string[];
	/** Certifications to spotlight on this role page (refs into the certifications collection). */
	featuredCertifications?: CertificationId[];
	/** Transferable skills to spotlight on this role page (refs into the transferableSkills collection). */
	featuredTransferableSkills?: TransferableSkillId[];
	featuredCaseStudies?: string[];
	/** Recruiter-facing "what I bring → what the role needs" bridges. */
	mappings?: RoleMapping[];
	/** Pitch page contents (lead + pillars + optional why-now / what-translates). Rendered by the shared Pitch.astro. */
	pitch?: PitchContent;
}

/** A role view = catalog entry merged with role-specific extras, so a consumer
 *  gets identity, chrome and content as one object. */
export type Role = BlueprintEntry & RoleDefinition;

/** The two halves a role module must export to be registered in the catalog. */
export interface RoleModule {
	entry: BlueprintEntry;
	definition: RoleDefinition;
}

export const assembleRole = ({ entry, definition }: RoleModule): Role => ({ ...entry, ...definition });

export const getRole = (roles: Role[], slug: string): Role | undefined => roles.find((role) => role.slug === slug);

export const roleIsEnabled = (role: Role): boolean => role.enabled ?? true;
export const roleIsVisible = (role: Role): boolean => roleIsEnabled(role) && !(role.hidden ?? false);

export const onlyEnabledRoles = (roles: Role[]): Role[] => roles.filter(roleIsEnabled);
export const onlyVisibleRoles = (roles: Role[]): Role[] => roles.filter(roleIsVisible);

/**
 * Projects and case studies are referenced by plain string, so nothing catches a
 * stale id and the section it feeds renders empty instead of failing. Existence
 * only: a project that is draft or unlisted is still a valid target.
 */
export async function findBrokenFeaturedIds(roles: Role[]): Promise<string[]> {
	const projects = await getCollection("projects");
	const byId = new Map(projects.map((project) => [project.id, project]));

	return roles.flatMap(({ slug, featuredProjects = [], featuredCaseStudies = [] }) => [
		...featuredProjects.filter((id) => !byId.has(id)).map((id) => `${slug}: featuredProjects "${id}" matches no project`),
		...featuredCaseStudies
			.map((id) => {
				const project = byId.get(id);
				if (!project) return `${slug}: featuredCaseStudies "${id}" matches no project`;
				if (!project.data.caseStudy) return `${slug}: featuredCaseStudies "${id}" has no caseStudy block`;
				return "";
			})
			.filter(Boolean),
	]);
}

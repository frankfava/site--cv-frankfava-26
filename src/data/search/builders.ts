/**
 * Define the atomic builders that build the rows of a search index.
 *
 * A builder answers one question: given the collection, what does a reader need
 * to see, and what should a query match on? It never says where the row links.
 * That is the target, resolved once per build from the anchor the index landed
 * this kind on in `src/data/search/index.ts`, and the same for every row the
 * builder returns.
 *
 * Define a builder below by calling `buildRows` with a `RowContext`, the list to
 * build from, and a function describing one item. Read the population the
 * landing section actually renders, so a hit always has a row waiting for it
 * when the page arrives.
 *
 * To add a kind: name it in `AtomicKind`, give it a glyph in `FALLBACK_ICON`,
 * describe it here and register it in `ATOMIC_BUILDERS`, then land it on a
 * section in that index's `atomics`.
 *
 * Every builder reaches `astro:content`, so nothing here may be imported by
 * anything the client loads.
 */

import { getCollection } from "astro:content";
import { ABOUT, SOCIALS } from "site:config";

import { getCertifications } from "@/lib/collections/certifications";
import { getSkills } from "@/lib/collections/skills";
import { getTransferableSkills } from "@/lib/collections/transferableSkills";
import { getWorkHistory } from "@/lib/collections/workHistory";
import { buildRows, type AtomicBuilder, type AtomicKind, type AtomicTarget, type IconRenderer, type SearchItem } from "@/lib/search";

/** The glyph a kind falls back to where the thing itself offers none it can draw. */
const FALLBACK_ICON: Record<AtomicKind | "social", string> = {
	skill: "ph:tag",
	project: "ph:rocket-launch",
	role: "ph:briefcase",
	certification: "ph:certificate",
	language: "ph:translate",
	transferable: "ph:lightbulb-filament",
	social: "ph:link",
};

const skills: AtomicBuilder = async (renderIcon, target) =>
	buildRows({ kind: "skill", fallbackIcon: FALLBACK_ICON.skill, target, renderIcon }, await getSkills(), ({ id, data }) => ({
		id,
		title: data.label,
		description: (data.keywords ?? []).join(", "),
		icon: data.icon,
		body: [data.label, data.note, ...(data.keywords ?? []), data.proficiency],
	}));

const projects: AtomicBuilder = async (renderIcon, target) =>
	buildRows({ kind: "project", fallbackIcon: FALLBACK_ICON.project, target, renderIcon }, await getCollection("projects", ({ data }) => !data.draft && data.listed), ({ id, data }) => ({
		id,
		title: data.title,
		description: [data.role, data.type].filter(Boolean).join(" · "),
		icon: data.icon,
		body: [data.title, data.role, data.summary, ...(data.highlights ?? []), ...(data.skills ?? []).map((skill) => skill.id)],
	}));

const roles: AtomicBuilder = async (renderIcon, target) =>
	buildRows({ kind: "role", fallbackIcon: FALLBACK_ICON.role, target, renderIcon }, await getWorkHistory(), ({ id, data }) => ({
		id,
		title: `${data.role} at ${data.company}`,
		description: [data.location, data.employmentType].filter(Boolean).join(" · "),
		body: [data.role, data.company, data.location, data.summary, ...(data.responsibilities ?? []), ...(data.achievements ?? []), ...(data.skills ?? [])],
	}));

const certifications: AtomicBuilder = async (renderIcon, target) =>
	// No icon: the collection's own is an issuer logo rather than a name this can draw.
	buildRows({ kind: "certification", fallbackIcon: FALLBACK_ICON.certification, target, renderIcon }, await getCertifications(), ({ id, data }) => ({
		id,
		title: data.certificate,
		description: [data.issuer, data.ranking].filter(Boolean).join(" · "),
		body: [data.certificate, data.issuer, data.ranking, data.credentialId],
	}));

const languages: AtomicBuilder = async (renderIcon, target) =>
	buildRows({ kind: "language", fallbackIcon: FALLBACK_ICON.language, target, renderIcon }, ABOUT.linguistics.languages, ({ language, fluency, description }) => ({
		id: language,
		title: language,
		description: fluency,
		body: [language, fluency, description],
	}));

const transferable: AtomicBuilder = async (renderIcon, target) =>
	buildRows(
		{ kind: "transferable", fallbackIcon: FALLBACK_ICON.transferable, target, renderIcon },
		(await getTransferableSkills()).filter(({ data }) => data.listed),
		({ id, data }) => ({
			id,
			title: data.title,
			description: data.summary,
			icon: data.icon,
			body: [data.title, data.subject, data.summary, ...(data.keywords ?? [])],
		}),
	);

export const ATOMIC_BUILDERS: Record<AtomicKind, AtomicBuilder> = {
	skill: skills,
	project: projects,
	role: roles,
	certification: certifications,
	language: languages,
	transferable: transferable,
};

/**
 * The social links.
 *
 * Not an atomic kind. They leave the site, so there is no section to land on and
 * no target to take a url from - each row carries its own href, and the target
 * exists only to give them a breadcrumb.
 */
export async function socialItems(renderIcon: IconRenderer): Promise<SearchItem[]> {
	const links = SOCIALS.getPlatforms().map((key) => ({ key, link: SOCIALS.getPlatform(key)! }));
	const offSite: AtomicTarget = { url: "", module: "", page: "Get in touch" };

	const rows = await buildRows({ kind: "social", fallbackIcon: FALLBACK_ICON.social, target: offSite, renderIcon }, links, ({ key, link }) => ({
		id: key,
		title: link.label ?? link.text,
		description: link.text,
		icon: link.icon,
		body: [link.label, link.text, key],
	}));

	return rows.map((row, i) => ({ ...row, url: links[i].link.href }));
}

/**
 * What each kind of thing says about itself in a result row.
 *
 * A builder answers one question per kind: given the collection, what goes in
 * the row? It never says where the row points or what breadcrumb it reads -
 * both come from the target, which is the section the index resolved that kind
 * onto, and which is identical for every row a builder returns.
 *
 * Each builder reads the population its landing section renders, so a hit
 * always has something waiting for it when the page arrives.
 *
 * Every one of them reaches `astro:content`, so nothing here may be imported by
 * anything the client loads.
 */

import { getCollection } from "astro:content";
import { ABOUT, SOCIALS } from "site:config";

import { getCertifications } from "@/lib/collections/certifications";
import { getSkills } from "@/lib/collections/skills";
import { getTransferableSkills } from "@/lib/collections/transferableSkills";
import { getWorkHistory } from "@/lib/collections/workHistory";
import type { AtomicBuilder, AtomicKind, AtomicTarget, IconRenderer, SearchItem, SearchItemKind } from "@/lib/search";

/** The glyph a kind falls back to, where the thing itself has no usable icon. */
const FALLBACK_ICON: Record<AtomicKind | "social", string> = {
	skill: "ph:tag",
	project: "ph:rocket-launch",
	role: "ph:briefcase",
	certification: "ph:certificate",
	language: "ph:translate",
	transferable: "ph:lightbulb-filament",
	social: "ph:link",
};

/** What a builder says about one thing. Everything else about the row is known already. */
interface Described {
	/** Unique within the kind. The kind is prefixed on the way out. */
	id: string;
	title: string;
	/** The line under the title, after the breadcrumb. */
	description?: string;
	/** An iconify name. Falls back to the kind's glyph if absent or too costly to ship. */
	icon?: string;
	/** Everything a query should match on. Empty parts are dropped. */
	body: (string | undefined)[];
}

/** Turn a collection into rows of one kind, all landing on the same target. */
async function rows<T>(kind: SearchItemKind, target: AtomicTarget, renderIcon: IconRenderer, list: T[], describe: (item: T) => Described): Promise<SearchItem[]> {
	return Promise.all(
		list.map(async (item) => {
			const { id, title, description = "", icon, body } = describe(item);
			return {
				id: `${kind}:${id}`,
				title,
				description,
				body: body.filter(Boolean).join(" "),
				iconHtml: (icon ? await renderIcon(icon) : "") || (await renderIcon(FALLBACK_ICON[kind as AtomicKind | "social"])),
				// Where it goes and what it reads as, from the section the index landed this kind on.
				url: target.url,
				module: target.module,
				page: target.page,
				kind,
				// Only a section that wraps other sections is a group.
				isGroup: false,
			};
		}),
	);
}

const skills: AtomicBuilder = async (renderIcon, target) =>
	rows("skill", target, renderIcon, await getSkills(), ({ id, data }) => ({
		id,
		title: data.label,
		description: (data.keywords ?? []).join(", "),
		icon: data.icon,
		body: [data.label, data.note, ...(data.keywords ?? []), data.proficiency],
	}));

const projects: AtomicBuilder = async (renderIcon, target) =>
	rows("project", target, renderIcon, await getCollection("projects", ({ data }) => !data.draft && data.listed), ({ id, data }) => ({
		id,
		title: data.title,
		description: [data.role, data.type].filter(Boolean).join(" · "),
		icon: data.icon,
		body: [data.title, data.role, data.summary, ...(data.highlights ?? []), ...(data.skills ?? []).map((skill) => skill.id)],
	}));

const roles: AtomicBuilder = async (renderIcon, target) =>
	rows("role", target, renderIcon, await getWorkHistory(), ({ id, data }) => ({
		id,
		title: `${data.role} at ${data.company}`,
		description: [data.location, data.employmentType].filter(Boolean).join(" · "),
		body: [data.role, data.company, data.location, data.summary, ...(data.responsibilities ?? []), ...(data.achievements ?? []), ...(data.skills ?? [])],
	}));

const certifications: AtomicBuilder = async (renderIcon, target) =>
	// The collection's own `icon` is an issuer logo rather than a name this can draw.
	rows("certification", target, renderIcon, await getCertifications(), ({ id, data }) => ({
		id,
		title: data.certificate,
		description: [data.issuer, data.ranking].filter(Boolean).join(" · "),
		body: [data.certificate, data.issuer, data.ranking, data.credentialId],
	}));

const languages: AtomicBuilder = async (renderIcon, target) =>
	rows("language", target, renderIcon, ABOUT.linguistics.languages, ({ language, fluency, description }) => ({
		id: language,
		title: language,
		description: fluency,
		body: [language, fluency, description],
	}));

const transferable: AtomicBuilder = async (renderIcon, target) =>
	rows(
		"transferable",
		target,
		renderIcon,
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
 * Not an atomic kind: they leave the site, so there is no section to land on and
 * no target to take a url from. Each row carries its own href instead.
 */
export async function socialItems(renderIcon: IconRenderer): Promise<SearchItem[]> {
	const links = SOCIALS.getPlatforms().map((key) => ({ key, link: SOCIALS.getPlatform(key)! }));
	const offSite: AtomicTarget = { url: "", module: "", page: "Get in touch" };

	const items = await rows("social", offSite, renderIcon, links, ({ key, link }) => ({
		id: key,
		title: link.label ?? link.text,
		description: link.text,
		icon: link.icon,
		body: [link.label, link.text, key],
	}));

	return items.map((item, i) => ({ ...item, url: links[i].link.href }));
}

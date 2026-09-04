/**
 * Where the rows come from.
 *
 * One builder per atomic kind, each reading the population its landing section
 * renders, so a hit always has a row waiting for it when the page arrives.
 * Every one of them reaches `astro:content`, so nothing here may be imported
 * from anything the client loads.
 */

import { getCollection } from "astro:content";
import { ABOUT, SOCIALS } from "site:config";

import { getCertifications } from "@/lib/collections/certifications";
import { getSkills } from "@/lib/collections/skills";
import { getTransferableSkills } from "@/lib/collections/transferableSkills";
import { getWorkHistory } from "@/lib/collections/workHistory";
import type { AtomicBuilder, AtomicKind, IconRenderer, SearchItem } from "./types";

/** What a row of each kind shows where its own data carries no usable icon. */
export const ATOMIC_ICON: Record<AtomicKind, string> = {
	skill: "ph:tag",
	project: "ph:rocket-launch",
	role: "ph:briefcase",
	certification: "ph:certificate",
	language: "ph:translate",
	transferable: "ph:lightbulb-filament",
};

/** What a social row shows where the link carries no icon. */
const SOCIAL_ICON = "ph:link";

/**
 * The row's own icon, or the plain glyph for its kind.
 *
 * The renderer returns nothing for a name it cannot draw and for one that costs
 * more than a row's icon is worth, so both cases land here.
 */
async function icon(renderIcon: IconRenderer, name: string | undefined, fallback: string): Promise<string> {
	return (name ? await renderIcon(name) : "") || (await renderIcon(fallback));
}

const skillItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const skills = await getSkills();
	return Promise.all(
		skills.map(async ({ id, data }) => ({
			id: `skill:${id}`,
			url,
			title: data.label,
			description: (data.keywords ?? []).join(", "),
			iconHtml: await icon(renderIcon, data.icon, ATOMIC_ICON.skill),
			module,
			page,
			body: [data.label, data.note, ...(data.keywords ?? []), data.proficiency].filter(Boolean).join(" "),
			kind: "skill" as const,
			isGroup: false,
		})),
	);
};

const projectItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const projects = await getCollection("projects", ({ data }) => !data.draft && data.listed);
	return Promise.all(
		projects.map(async ({ id, data }) => ({
			id: `project:${id}`,
			url,
			title: data.title,
			description: [data.role, data.type].filter(Boolean).join(" · "),
			iconHtml: await icon(renderIcon, data.icon, ATOMIC_ICON.project),
			module,
			page,
			body: [data.title, data.role, data.summary, ...(data.highlights ?? []), ...(data.skills ?? []).map(({ id: skill }) => skill)].filter(Boolean).join(" "),
			kind: "project" as const,
			isGroup: false,
		})),
	);
};

const roleItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const history = await getWorkHistory();
	return Promise.all(
		history.map(async ({ id, data }) => ({
			id: `role:${id}`,
			url,
			title: `${data.role} at ${data.company}`,
			description: [data.location, data.employmentType].filter(Boolean).join(" · "),
			iconHtml: await icon(renderIcon, undefined, ATOMIC_ICON.role),
			module,
			page,
			body: [data.role, data.company, data.location, data.summary, ...(data.responsibilities ?? []), ...(data.achievements ?? []), ...(data.skills ?? [])].filter(Boolean).join(" "),
			kind: "role" as const,
			isGroup: false,
		})),
	);
};

const certificationItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const certifications = await getCertifications();
	return Promise.all(
		certifications.map(async ({ id, data }) => ({
			id: `certification:${id}`,
			url,
			title: data.certificate,
			description: [data.issuer, data.ranking].filter(Boolean).join(" · "),
			// The collection's own `icon` is an issuer logo rather than a name this can draw.
			iconHtml: await icon(renderIcon, undefined, ATOMIC_ICON.certification),
			module,
			page,
			body: [data.certificate, data.issuer, data.ranking, data.credentialId].filter(Boolean).join(" "),
			kind: "certification" as const,
			isGroup: false,
		})),
	);
};

const languageItems: AtomicBuilder = async (renderIcon, { url, module, page }) =>
	Promise.all(
		ABOUT.linguistics.languages.map(async ({ language, fluency, description }) => ({
			id: `language:${language}`,
			url,
			title: language,
			description: fluency,
			iconHtml: await icon(renderIcon, undefined, ATOMIC_ICON.language),
			module,
			page,
			body: [language, fluency, description].filter(Boolean).join(" "),
			kind: "language" as const,
			isGroup: false,
		})),
	);

const transferableItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const skills = (await getTransferableSkills()).filter(({ data }) => data.listed);
	return Promise.all(
		skills.map(async ({ id, data }) => ({
			id: `transferable:${id}`,
			url,
			title: data.title,
			description: data.summary ?? "",
			iconHtml: await icon(renderIcon, data.icon, ATOMIC_ICON.transferable),
			module,
			page,
			body: [data.title, data.subject, data.summary, ...(data.keywords ?? [])].filter(Boolean).join(" "),
			kind: "transferable" as const,
			isGroup: false,
		})),
	);
};

export const ATOMIC_BUILDERS: Record<AtomicKind, AtomicBuilder> = {
	skill: skillItems,
	project: projectItems,
	role: roleItems,
	certification: certificationItems,
	language: languageItems,
	transferable: transferableItems,
};

/** The social links, which navigate off-site and so land on no page of their own. */
export async function socialItems(renderIcon: IconRenderer): Promise<SearchItem[]> {
	return Promise.all(
		SOCIALS.getPlatforms().map(async (key) => {
			const link = SOCIALS.getPlatform(key)!;
			return {
				id: `social:${key}`,
				url: link.href,
				title: link.label ?? link.text,
				description: link.text,
				iconHtml: await icon(renderIcon, link.icon, SOCIAL_ICON),
				module: "",
				page: "Get in touch",
				body: [link.label, link.text, key].filter(Boolean).join(" "),
				kind: "social" as const,
				isGroup: false,
			};
		}),
	);
}

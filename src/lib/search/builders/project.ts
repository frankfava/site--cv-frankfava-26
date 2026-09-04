import { getCollection } from "astro:content";
import { ATOMIC_ICON, iconOrFallback } from "./icons";
import type { AtomicBuilder } from "./types";

/** The population the projects section renders, so a hit always has a row waiting for it. */
export const projectItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const projects = await getCollection("projects", ({ data }) => !data.draft && data.listed);
	return Promise.all(
		projects.map(async ({ id, data }) => ({
			id: `project:${id}`,
			url,
			title: data.title,
			description: [data.role, data.type].filter(Boolean).join(" · "),
			iconHtml: await iconOrFallback(renderIcon, data.icon, ATOMIC_ICON.project),
			module,
			page,
			body: [data.title, data.role, data.summary, ...(data.highlights ?? []), ...(data.skills ?? []).map(({ id: skill }) => skill)].filter(Boolean).join(" "),
			kind: "project" as const,
			isGroup: false,
		})),
	);
};

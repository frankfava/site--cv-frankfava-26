import { getSkills } from "@/lib/collections/skills";
import { ATOMIC_ICON, iconOrFallback } from "./icons";
import type { AtomicBuilder } from "./types";

export const skillItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const skills = await getSkills();
	return Promise.all(
		skills.map(async ({ id, data }) => ({
			id: `skill:${id}`,
			url,
			title: data.label,
			description: (data.keywords ?? []).join(", "),
			iconHtml: await iconOrFallback(renderIcon, data.icon, ATOMIC_ICON.skill),
			module,
			page,
			body: [data.label, data.note, ...(data.keywords ?? []), data.proficiency].filter(Boolean).join(" "),
			kind: "skill" as const,
			isGroup: false,
		})),
	);
};

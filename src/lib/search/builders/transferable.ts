import { getTransferableSkills } from "@/lib/collections/transferableSkills";
import { ATOMIC_ICON, iconOrFallback } from "./icons";
import type { AtomicBuilder } from "./types";

/** The population the section renders, so a hit always has a row waiting for it. */
export const transferableItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const skills = (await getTransferableSkills()).filter(({ data }) => data.listed);
	return Promise.all(
		skills.map(async ({ id, data }) => ({
			id: `transferable:${id}`,
			url,
			title: data.title,
			description: data.summary ?? "",
			iconHtml: await iconOrFallback(renderIcon, data.icon, ATOMIC_ICON.transferable),
			module,
			page,
			body: [data.title, data.subject, data.summary, ...(data.keywords ?? [])].filter(Boolean).join(" "),
			kind: "transferable" as const,
			isGroup: false,
		})),
	);
};

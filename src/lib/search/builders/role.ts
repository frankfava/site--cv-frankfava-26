import { getWorkHistory } from "@/lib/collections/workHistory";
import { ATOMIC_ICON } from "./icons";
import type { AtomicBuilder } from "./types";

export const roleItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const history = await getWorkHistory();
	return Promise.all(
		history.map(async ({ id, data }) => ({
			id: `role:${id}`,
			url,
			title: `${data.role} at ${data.company}`,
			description: [data.location, data.employmentType].filter(Boolean).join(" · "),
			iconHtml: await renderIcon(ATOMIC_ICON.role),
			module,
			page,
			body: [data.role, data.company, data.location, data.summary, ...(data.responsibilities ?? []), ...(data.achievements ?? []), ...(data.skills ?? [])].filter(Boolean).join(" "),
			kind: "role" as const,
			isGroup: false,
		})),
	);
};

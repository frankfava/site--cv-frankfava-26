import { SOCIALS } from "site:config";
import { SOCIAL_ICON, iconOrFallback } from "./icons";
import type { IconRenderer } from "./types";
import type { SearchItem } from "../types";

/** The social links, which navigate off-site and so land on no page of their own. */
export async function socialItems(renderIcon: IconRenderer): Promise<SearchItem[]> {
	const platforms = SOCIALS.getPlatforms();
	return Promise.all(
		platforms.map(async (key) => {
			const link = SOCIALS.getPlatform(key)!;
			return {
				id: `social:${key}`,
				url: link.href,
				title: link.label ?? link.text,
				description: link.text,
				iconHtml: await iconOrFallback(renderIcon, link.icon, SOCIAL_ICON),
				module: "",
				page: "Get in touch",
				body: [link.label, link.text, key].filter(Boolean).join(" "),
				kind: "social" as const,
				isGroup: false,
			};
		}),
	);
}

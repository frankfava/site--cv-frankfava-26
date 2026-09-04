import { ABOUT } from "site:config";
import { ATOMIC_ICON } from "./icons";
import type { AtomicBuilder } from "./types";

export const languageItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	return Promise.all(
		ABOUT.linguistics.languages.map(async ({ language, fluency, description }) => ({
			id: `language:${language}`,
			url,
			title: language,
			description: fluency,
			iconHtml: await renderIcon(ATOMIC_ICON.language),
			module,
			page,
			body: [language, fluency, description].filter(Boolean).join(" "),
			kind: "language" as const,
			isGroup: false,
		})),
	);
};

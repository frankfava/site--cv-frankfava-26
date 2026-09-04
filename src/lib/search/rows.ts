/**
 * Turning things into rows.
 *
 * A row has two halves. What it *is* comes from the thing itself and is
 * described per kind in `@/data/search`. Where it *goes* comes from the target,
 * and is the same for every row of that kind. This is where the two are joined.
 */

import type { AtomicKind, AtomicTarget, IconRenderer, RowDescription, SearchItem, SearchItemKind } from "./types";

/** The glyph a kind falls back to where the thing itself offers none it can draw. */
export const FALLBACK_ICON: Record<AtomicKind | "social", string> = {
	skill: "ph:tag",
	project: "ph:rocket-launch",
	role: "ph:briefcase",
	certification: "ph:certificate",
	language: "ph:translate",
	transferable: "ph:lightbulb-filament",
	social: "ph:link",
};

/**
 * Turn a list into rows of one kind, every one landing on the same target.
 *
 * `describe` is the only part that differs between kinds, which is why it is
 * the only part authored as data.
 */
export async function buildRows<T>(kind: SearchItemKind, target: AtomicTarget, renderIcon: IconRenderer, list: T[], describe: (item: T) => RowDescription): Promise<SearchItem[]> {
	const fallback = FALLBACK_ICON[kind as AtomicKind | "social"];

	return Promise.all(
		list.map(async (item) => {
			const { id, title, description = "", icon, body } = describe(item);

			return {
				id: `${kind}:${id}`,
				title,
				description,
				body: body.filter(Boolean).join(" "),
				// The renderer returns nothing for a name it cannot draw and for one
				// over budget, so the kind's glyph covers both.
				iconHtml: (icon ? await renderIcon(icon) : "") || (await renderIcon(fallback)),
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

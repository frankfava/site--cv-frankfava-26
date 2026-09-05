/**
 * Builds the rows of one atomic kind.
 *
 * A row is two parts. What it contains comes from the item, and is described per
 * kind in `src/data/search/builders.ts`. Where it links comes from the target,
 * and is the same for every row of that kind.
 */

import type { RowContext, RowDescription, SearchItem } from "./types";

/**
 * Turn a list into rows of one kind, each landing on the same target.
 *
 * `describe` is the only part that differs between kinds, which is why it is the
 * only part authored as data.
 */
export async function buildRows<T>({ kind, fallbackIcon, target, renderIcon }: RowContext, list: T[], describe: (item: T) => RowDescription): Promise<SearchItem[]> {
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
				iconHtml: (icon ? await renderIcon(icon) : "") || (await renderIcon(fallbackIcon)),
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

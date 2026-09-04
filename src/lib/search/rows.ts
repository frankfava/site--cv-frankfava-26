/**
 * Turning things into rows.
 *
 * A row has two halves. What it *is* comes from the thing itself and is
 * described per kind in `@/data/search`. Where it *goes* comes from the target,
 * and is the same for every row of that kind. This is where the two are joined.
 */

import type { RowContext, RowDescription, SearchItem } from "./types";

/**
 * Turn a list into rows of one kind, every one landing on the same target.
 *
 * `describe` is the only part that differs between kinds, which is why it is
 * the only part authored as data.
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

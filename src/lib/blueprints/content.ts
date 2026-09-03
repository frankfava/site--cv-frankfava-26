/**
 * The contract between a part's content module and whatever renders it.
 *
 * Both media load the same modules and honour the same visibility rule, so the
 * rule lives here rather than in each renderer: a copy that drifts hides a part
 * on one medium and shows it on the other, and nothing fails while it does.
 */

import type { AstroInstance } from "astro";
import type { PartContent } from "./schema";

/** A content module: the component, and the optional rule for its own visibility. */
export type PartModule = AstroInstance & { resolve?: (context?: unknown) => unknown };

export const isAsyncLoader = (fn: unknown): fn is () => Promise<unknown> => typeof fn === "function" && fn.constructor?.name === "AsyncFunction";

/** Load a part's module, or nothing when its content is already markup. */
export async function loadPart(content: PartContent): Promise<PartModule | undefined> {
	return isAsyncLoader(content) ? ((await content()) as PartModule) : undefined;
}

/**
 * A module may export `resolve()` to decide its own visibility. An empty array
 * or a falsy value hides it, which keeps the rule next to the renderer.
 *
 * `resolve` has to be exported: without `export`, a frontmatter declaration
 * stays scoped to the component's render function instead of the module.
 */
export async function isVisible(mod: PartModule | undefined, context?: unknown): Promise<boolean> {
	if (typeof mod?.resolve !== "function") return true;
	const result = await mod.resolve(context);
	return Array.isArray(result) ? result.length > 0 : !!result;
}

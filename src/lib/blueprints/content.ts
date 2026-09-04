/**
 * The contract between a part's content module and whatever renders it.
 *
 * Both media load the same modules and honour the same visibility rule, so the
 * rule lives here rather than in each renderer: a copy that drifts hides a part
 * on one medium and shows it on the other, and nothing fails while it does.
 */

import type { AstroInstance } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type { PartContent } from "./schema";

/** A content module: the component, and the optional rule for its own visibility. */
export type PartModule = AstroInstance & { resolve?: (context?: unknown) => unknown };

export const isAsyncLoader = (fn: unknown): fn is () => Promise<unknown> => typeof fn === "function" && fn.constructor?.name === "AsyncFunction";

/** Astro marks its own factories, so a component is told from a loader rather than guessed at. */
export const isComponent = (value: unknown): value is AstroComponentFactory => typeof value === "function" && (value as { isAstroComponentFactory?: boolean }).isAstroComponentFactory === true;

/** Load a part's module, or nothing when its content is markup or already a component. */
export async function loadPart(content: PartContent): Promise<PartModule | undefined> {
	return isAsyncLoader(content) ? ((await content()) as PartModule) : undefined;
}

/** The component a part renders, given directly or reached through its module. */
export function partComponent(content: PartContent, mod?: PartModule): AstroComponentFactory | undefined {
	return isComponent(content) ? content : mod?.default;
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

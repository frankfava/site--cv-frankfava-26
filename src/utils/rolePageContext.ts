import { METADATA } from "site:config";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { BrandChrome } from "@/utils/brands";
import type { AssembledBlueprint } from "@/lib/blueprints";

/**
 * Walk the assembled blueprint tree and collect every visible section's
 * anchor id. Used by Mappings.astro to decide whether `#foo` resolves
 * to an in-page anchor or a home-page anchor.
 */
export function collectAnchorIds(sections: AssembledBlueprint, acc: string[] = []): string[] {
	for (const section of sections) {
		if (!section.hidden && section.id) acc.push(section.id);
		if (section.sections?.length) collectAnchorIds(section.sections, acc);
	}
	return acc;
}

/**
 * Shared context for both `/roles/<slug>` and `/roles/<slug>/<brand>`.
 * Both routes need the same anchor-id collection and metadata shape; the
 * only difference is whether a branding's company name is appended to
 * the page title.
 */
export function buildRolePageContext({ entry, branding }: { entry: BlueprintEntry; branding?: BrandChrome }) {
	const titleSuffix = branding ? ` (${branding.company})` : "";
	return {
		roleAnchorIds: collectAnchorIds(entry.blueprint.assemble()),
		metadata: {
			title: `${METADATA?.title?.default} - ${entry.title}${titleSuffix}`,
			description: entry.description,
			ignoreTitleTemplate: true,
		},
	};
}

import { METADATA } from "site:config";
import type { AssembledBlueprint, BlueprintEntry } from "@/lib/blueprints";

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

export function buildRolePageContext({ entry }: { entry: BlueprintEntry }) {
	return {
		roleAnchorIds: collectAnchorIds(entry.blueprint.assemble()),
		metadata: {
			title: `${METADATA?.title?.default} - ${entry.title}`,
			description: entry.description,
			ignoreTitleTemplate: true,
		},
	};
}

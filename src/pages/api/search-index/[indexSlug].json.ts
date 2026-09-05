/**
 * One JSON file per search index, written at build.
 *
 * Each search index is generated on build as we the search catalog is
 * enumerated by `getStaticPaths` which is populated by the index catalog
 * that we defined in `src/data/search/index.ts`.
 */

import type { APIRoute } from "astro";
import { blueprints } from "@/data/blueprints";
import { searchIndicies } from "@/data/search";
import { ATOMIC_BUILDERS, socialItems } from "@/data/search/builders";
import { buildSearchIndex } from "@/lib/search/build";
import { blueprintsInIndex } from "@/lib/search";

export const getStaticPaths = () => Object.keys(searchIndicies).map((indexSlug) => ({ params: { indexSlug } }));

export const GET: APIRoute = async ({ params }) => {
	const index = searchIndicies[params.indexSlug!];
	if (!index) return new Response(JSON.stringify([]), { status: 404, headers: { "Content-Type": "application/json" } });

	const items = await buildSearchIndex(index, blueprintsInIndex(Object.values(blueprints), searchIndicies, index.slug), { atomics: ATOMIC_BUILDERS, socials: socialItems });

	return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
};

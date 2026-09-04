/**
 * One JSON file per search index, written at build.
 *
 * `getStaticPaths` enumerates the search catalog rather than the blueprint one,
 * because an index is a scope and a scope can span pages: the six content pages
 * share a single file, fetched once and reused as the visitor moves between
 * them. A page that names no index is served by nothing here, which is what
 * keeps the one-pagers and the role pages out.
 */

import type { APIRoute } from "astro";
import { blueprints } from "@/data/blueprints";
import { searchIndicies } from "@/data/search";
import { ATOMIC_BUILDERS, socialItems } from "@/data/search/builders";
import { buildSearchIndex } from "@/lib/search/build";
import { pagesInIndex } from "@/lib/search";

export const getStaticPaths = () => Object.keys(searchIndicies).map((indexSlug) => ({ params: { indexSlug } }));

export const GET: APIRoute = async ({ params }) => {
	const index = searchIndicies[params.indexSlug!];
	if (!index) return new Response(JSON.stringify([]), { status: 404, headers: { "Content-Type": "application/json" } });

	const items = await buildSearchIndex(index, pagesInIndex(Object.values(blueprints), searchIndicies, index.slug), { atomics: ATOMIC_BUILDERS, socials: socialItems });

	return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
};

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
import { searchIndexes } from "@/data/search";
import { ATOMIC_BUILDERS, socialItems } from "@/data/search/builders";
import { buildSearchIndex } from "@/lib/search/build";
import { pagesInIndex } from "@/lib/search";

export const getStaticPaths = () => Object.keys(searchIndexes).map((indexSlug) => ({ params: { indexSlug } }));

export const GET: APIRoute = async ({ params }) => {
	const index = searchIndexes[params.indexSlug!];
	if (!index) return new Response(JSON.stringify([]), { status: 404, headers: { "Content-Type": "application/json" } });

	const items = await buildSearchIndex(index, pagesInIndex(Object.values(blueprints), searchIndexes, index.slug), { atomics: ATOMIC_BUILDERS, socials: socialItems });

	return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
};

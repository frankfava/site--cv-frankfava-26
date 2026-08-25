/**
 * Catalog of every page-driving blueprint.
 *
 * Each entry maps a stable slug → an assembled `BlueprintBuilder`, plus any
 * cross-cutting page-shell config (search scoping, layout chrome). The slug
 * is the source of truth used by:
 *   - the dynamic search-index endpoint (`/api/search-index/[blueprintSlug].json`)
 *   - `Search.astro` to fetch the right scoped index
 *   - role landing pages (which derive their slugs from `ROLES` in `@/utils/roles.ts`)
 *
 * Every blueprint file (static or role) exports its own `entry`.
 */

import type { BlueprintEntry } from "../lib/blueprints/types";

export const blueprints: Record<string, BlueprintEntry> = {
};

export const blueprintSlugs: string[] = Object.keys(blueprints);

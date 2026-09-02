import { getRole, roleIsEnabled, type Role } from "@/lib/roles";

/**
 * What a brand may change about a role. Narrow on purpose - slug, blueprint and
 * config are off-limits, so a brand can only reorder or reselect the evidence a
 * role page already leads with.
 */
export type BrandRoleOverride = Partial<Omit<Role, "slug" | "blueprint" | "config">>;

export interface Brand {
	key: string;
	/** The company as it reads on the page. */
	company: string;
	/** Role slug → the override this brand layers onto that role. */
	roles: Record<string, BrandRoleOverride>;
}

/** A role as one brand serves it. */
export interface BrandRole {
	brand: Brand;
	role: Role;
}

/**
 * Every pair a brand actually serves. A disabled role has no page to brand, so
 * the catalog's decision wins over the brand's reference to it.
 */
export function brandRoles(brands: Brand[], roles: Role[]): BrandRole[] {
	return brands.flatMap((brand) =>
		Object.entries(brand.roles).flatMap(([slug, override]) => {
			const role = getRole(roles, slug);
			if (!role || !roleIsEnabled(role)) return [];
			return [{ brand, role: { ...role, ...override } }];
		}),
	);
}

export function getBrandRole(brands: Brand[], roles: Role[], key: string, slug: string): BrandRole | undefined {
	return brandRoles(brands, roles).find(({ brand, role }) => brand.key === key && role.slug === slug);
}

/**
 * A role map is hand-authored against slugs the catalog owns, so a rename or a
 * disabled role leaves a reference that quietly serves nothing. A brand with no
 * pages left is the failure that would otherwise look like it worked.
 */
export function findUnservedBrands(brands: Brand[], roles: Role[]): string[] {
	return brands.flatMap((brand) => [
		...Object.keys(brand.roles)
			.filter((slug) => !getRole(roles, slug))
			.map((slug) => `${brand.key}: "${slug}" matches no role`),
		...(brandRoles([brand], roles).length ? [] : [`${brand.key}: serves no page - every role it lists is missing or disabled`]),
	]);
}

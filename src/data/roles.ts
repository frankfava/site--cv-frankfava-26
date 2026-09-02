/**
 * Every role this CV is aimed at.
 *
 * Role-page content joins on by slug when those pages exist; it does not merge
 * into this file.
 */

export interface Role {
	slug: string;
	title: string;
	summary: string;
	/** Disabled means no page is built. Hidden means the page exists but nothing lists it. */
	enabled?: boolean;
	hidden?: boolean;
}

export const ROLES: Role[] = [
	{
		slug: "engineering-manager",
		title: "Engineering Manager",
		summary: "Coaching was my first profession, not a second skill. Interim or fixed term suits me best.",
	},
	{
		slug: "solutions-architect",
		title: "AI Solutions Architect",
		summary: "The first technical voice a customer hears. Discovery, demos, architecture, business case.",
	},
	{
		slug: "forward-deployed-engineer",
		title: "Forward Deployed Engineer",
		summary: "Embedded with the customer, owning the technical call from first conversation to production.",
	},
	{
		slug: "senior-engineer",
		title: "Senior Engineer",
		summary: "Eighteen years of it, and genuinely good, but I'm moving toward the customer, not away.",
	},
	{
		enabled: false,
		slug: "technical-evangelist",
		title: "Technical Evangelist",
		summary: "Coaching, sales, and a decade of hands-on engineering.",
	},
];

export const roleIsEnabled = (role: Role): boolean => role.enabled ?? true;
export const roleIsVisible = (role: Role): boolean => roleIsEnabled(role) && !(role.hidden ?? false);

export const onlyEnabledRoles = (roles: Role[]): Role[] => roles.filter(roleIsEnabled);
export const onlyVisibleRoles = (roles: Role[]): Role[] => roles.filter(roleIsVisible);

export const getRoleBySlug = (slug: string): Role | undefined => ROLES.find((role) => role.slug === slug);

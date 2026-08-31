/**
 * The same evidence, reordered per role, each with a page you can forward.
 *
 * Solutions Architect and Engineering Manager lead, matching the hero eyebrow.
 * Forward Deployed Engineer stays a dossier rather than a headline: the title
 * is niche and it is not clear what expectations it sets.
 */
import type { _Card } from "@/types";

export const DOSSIERS: _Card[] = [
	{
		id: "solutions-architect",
		eyebrow: "Closest match",
		title: "AI Solutions Architect",
		body: "The first technical voice a customer hears. Discovery, demos, architecture, business case.",
		link: { href: "/roles/solutions-architect" },
	},
	{
		id: "engineering-manager",
		eyebrow: "Where the signal is",
		title: "Engineering Manager",
		body: "Coaching was my first profession, not a second skill. Interim or fixed term suits me best.",
		link: { href: "/roles/engineering-manager" },
	},
	{
		id: "forward-deployed-engineer",
		eyebrow: "Same job, field org",
		title: "Forward Deployed Engineer",
		body: "Embedded with the customer, owning the technical call from first conversation to production.",
		link: { href: "/roles/forward-deployed-engineer" },
	},
	{
		id: "senior-engineer",
		eyebrow: "Proven",
		title: "Senior Engineer",
		body: "Eighteen years of it, and genuinely good, but I'm moving toward the customer, not away.",
		link: { href: "/roles/senior-engineer" },
	},
];

// const order = ["solutions-architect", "engineering-manager", "forward-deployed-engineer", "senior-engineer"];

// const rank = (role: Role): number => {
// 	const i = order.indexOf(role.slug);
// 	return i === -1 ? order.length : i;
// };

// const roles = onlyVisibleRoles(ROLES).sort((a, b) => rank(a) - rank(b));

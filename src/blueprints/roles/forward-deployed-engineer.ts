import { buildRoleStructure } from ".";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/data/roleDefinitions";

export const blueprint = buildBlueprint(buildRoleStructure("Forward Deployed Engineer"));

export const entry: BlueprintEntry = {
	slug: "forward-deployed-engineer",
	title: "Forward Deployed Engineer",
	description:
		"Why I'd be a great Forward Deployed Engineer - post-sales delivery embedded in customer systems, shipping technical artifacts, white-glove support, and codifying repeatable deployment patterns back into product.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	hidden: false,
	slug: entry.slug,
	featuredSkills: ["CLAUDE", "LARAVEL", "PHP", "VUEJS", "REACT", "ASTRO", "TYPESCRIPT", "AWS", "DOCKER", "API", "POSTGRESQL", "FILAMENTPHP"],
	featuredProjects: ["ai-skill-create-mvp", "hubspot-fieldsjs", "nas", "savr-admin-panels", "savr-delta-system", "lovable-output-analyser"],
	featuredCaseStudies: ["nas", "savr-admin-panels", "hubspot-fieldsjs", "savr-delta-system"],
	featuredCertifications: ["testdome-laravel", "testdome-rest-api", "testdome-leadership", "testdome-logical", "testdome-abstract", "testdome-ai"],
	featuredTransferableSkills: ["customer-service", "project-management", "ability-to-lead", "team-player", "sales-and-business-development"],
	pitch: {
		whyNow: {
			paragraphs: [
				`After 18 years building - much of it embedded directly in customers' systems as a freelancer and part-time CTO - Forward Deployed Engineer is the role I've effectively been doing without the title. It's the post-sales half of the work I love: not pitching the solution, but moving into the customer's environment and making it real.`,
				`An FDE lands after the deal is signed and owns the gap between "great product" and "working in production for <em>this</em> customer." That's been my whole career: parachute into an unfamiliar codebase or business, build the thing that actually fits, and stay until it sticks.`,
			],
		},
		lead: "An FDE's job is to embed with a customer and turn a product into a production system that ships, sticks, and grows the account. That sits at the intersection of three things I've spent my career doing: building inside other people's systems, supporting customers hands-on, and codifying what works so it scales.",
		pillars: [
			{
				icon: "ph:wrench-duotone",
				title: "Building production systems inside customer environments",
				body: "Years building and operating production software inside other people's systems and constraints - most notably nearly 4 years as part-time CTO at National Auto Service, owning the platform end to end. Not prototypes handed over a wall; systems I shipped, ran, and kept alive.",
			},
			{
				icon: "ph:package-duotone",
				title: "Shipping technical artifacts, not just advice",
				body: "The deliverable is working software. I build the concrete things a customer needs to adopt a product - internal tools, integrations, and, for an AI product, artifacts like sub-agents and agent skills. I've already productized my own consulting method as a Claude Code skill (Create MVP), so codifying capability into reusable artifacts is how I work.",
			},
			{
				icon: "ph:hand-heart-duotone",
				title: "White-glove development support",
				body: "Self-employed survival ran on being the person the customer could call. I embed with a customer's team, unblock them on their turf, and adapt to their stack and their pace - the high-touch, low-ego support that makes an engagement succeed instead of stall.",
			},
			{
				icon: "ph:arrows-clockwise-duotone",
				title: "Codifying repeatable patterns and feeding them back",
				body: "When I solve something once for a customer, I look for the reusable pattern. HubSpot FieldsJS started as a fix for a recurring customer-project pain, became an open-source tool, and was adopted into HubSpot's own docs - a deployment pattern codified and pushed back to the vendor. That customer → pattern → product/eng loop is the core of the FDE job.",
			},
		],
		whatTranslates: {
			title: "What translates from freelance & agency work",
			bullets: [
				{ from: "Embedded in customer systems for years at a time", to: "working inside customer environments to build production applications." },
				{ from: "Delivered tools, integrations and open-source artifacts", to: "shipping technical artifacts (sub-agents, agent skills, internal tools) to meet customer requirements." },
				{ from: "Was the customer's on-call developer as a freelancer", to: "white-glove development support." },
				{ from: "Turned a recurring customer pain into an adopted open-source tool", to: "codifying repeatable deployment patterns and sending insight back to product/eng." },
				{ from: "90%+ revenue from referrals + repeat business", to: "building long-term relationships and finding new opportunities across the engagement." },
			],
		},
	},
	mappings: [
		{
			from: { label: "Part-time CTO embedded at National Auto Service (nearly 4 years, built + operated in prod)" },
			to: "Working within customer systems to build and run production applications",
			note: "Owned architecture, security and delivery for a platform now used across ~90% of Australia - and stayed to operate it.",
		},
		{
			from: { label: "Shipped FilamentPHP + Streamlit tooling inside SAVR's stack" },
			to: "Delivering technical artifacts that meet customer requirements",
			note: "Built production operability tools the data and customer-service teams use daily inside a regulated fintech.",
		},
		{
			from: { label: "Was the freelancer customers called directly for 18 years" },
			to: "White-glove, hands-on development support",
		},
		{
			from: { label: "HubSpot FieldsJS: customer pain → open-source tool → adopted by HubSpot" },
			to: "Identifying and codifying repeatable deployment patterns, and feeding insight back to product/eng",
			note: "A recurring delivery problem turned into a reusable artifact the vendor referenced in their own docs.",
		},
		{
			from: { label: "Productized my delivery methodology as the Create MVP Claude skill" },
			to: "Building reusable artifacts (agent skills) for an AI-product context",
		},
		{
			from: { label: "90%+ referral / repeat revenue over 18 years self-employed" },
			to: "Building long-term customer relationships and surfacing new opportunities",
		},
		{
			from: { label: "Pick up new stacks fast via SOLID, TDD and design patterns" },
			to: "Maintaining current capability and adapting to each customer's stack",
		},
	],
};

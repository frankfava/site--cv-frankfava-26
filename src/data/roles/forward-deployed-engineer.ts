import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";
import { codingYears, yearsIn } from "@/lib/spans";

export const blueprint = buildBlueprint(buildRoleStructure("Forward Deployed Engineer"));

export const entry: BlueprintEntry = {
	slug: "forward-deployed-engineer",
	title: "Forward Deployed Engineer",
	description:
		"The role I have been doing without the title. Embedded in customer systems for years at a time, shipping the working software rather than the advice, and turning what worked into something reusable.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	summary: "Embedded with the customer, owning the technical call from first conversation to production.",
	hidden: false,
	slug: entry.slug,
	featuredSkills: ["CLAUDE", "LARAVEL", "PHP", "VUEJS", "REACT", "ASTRO", "TYPESCRIPT", "AWS", "DOCKER", "API", "POSTGRESQL", "FILAMENTPHP"],
	featuredCapabilities: ["cust", "code", "ai", "arch"],
	featuredProjects: ["nas", "hubspot-fieldsjs", "savr-admin-panels", "savr-delta-system", "frankenverse-agentic-system", "ai-skill-create-mvp"],
	featuredCaseStudies: ["nas", "savr-admin-panels", "hubspot-fieldsjs", "savr-delta-system"],
	featuredCertifications: ["testdome-laravel", "testdome-rest-api", "testdome-leadership", "testdome-logical", "testdome-abstract", "testdome-ai"],
	featuredTransferableSkills: ["customer-service", "project-management", "ability-to-lead", "team-player", "sales-and-business-development"],
	pitch: {
		whyNow: {
			paragraphs: [
				`${codingYears()} years building, much of it embedded directly in customers' systems as a freelancer and part-time CTO. Forward Deployed Engineer is the role I have effectively been doing without the title. It is the post-sales half of the work: moving into the customer's environment and making the thing real there.`,
				`An FDE lands after the deal is signed and owns the gap between "great product" and "working in production for <em>this</em> customer." That has been my whole career: land in an unfamiliar codebase or business, build the thing that fits it, and stay until it sticks.`,
			],
		},
		lead: "An FDE embeds with a customer and turns a product into a production system that sticks. I have spent my career building inside other people's systems, being the person they call, and turning what worked into something the next engagement can reuse.",
		pillars: [
			{
				icon: "ph:wrench-duotone",
				title: "Building production systems inside customer environments",
				body: `Years building and operating production software inside other people's systems and constraints - most notably ${yearsIn("nas")} years as part-time CTO at National Auto Service, owning the platform end to end. These were systems I shipped, ran, and kept alive, rather than prototypes handed over a wall.`,
			},
			{
				icon: "ph:package-duotone",
				title: "Shipping technical artifacts, not just advice",
				body: "The deliverable is working software. I build the concrete things a customer needs to adopt a product - internal tools, integrations, and, for an AI product, artifacts like sub-agents and agent skills. I have already published my own delivery method as a Claude Code skill anyone can run, so turning capability into something reusable is how I work.",
			},
			{
				icon: "ph:hand-heart-duotone",
				title: "White-glove development support",
				body: "Self-employed survival ran on being the person the customer could call. I embed with a customer's team, unblock them on their own ground, and work at their pace and in their stack.",
			},
			{
				icon: "ph:arrows-clockwise-duotone",
				title: "Codifying repeatable patterns and feeding them back",
				body: "When I solve something once for a customer, I look for the reusable pattern. HubSpot FieldsJS started as a fix for a recurring customer-project pain, became an open-source tool, and and HubSpot's own team referenced it in their documentation. That loop, from a customer's problem to a pattern to something the vendor picks up, is the core of the FDE job.",
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
			from: { label: `Part-time CTO embedded at National Auto Service (${yearsIn("nas")} years, built + operated in prod)` },
			to: "Working within customer systems to build and run production applications",
			note: "Owned architecture, security and delivery for a platform now used across ~90% of Australia - and stayed to operate it.",
		},
		{
			from: { label: "Shipped FilamentPHP tooling inside SAVR's stack" },
			to: "Delivering technical artifacts that meet customer requirements",
			note: "Built production operability tools the data and customer-service teams use daily inside a regulated fintech.",
		},
		{
			from: { label: "Was the freelancer customers called directly, for most of a decade" },
			to: "White-glove, hands-on development support",
		},
		{
			from: { label: "HubSpot FieldsJS: customer pain → open-source tool → adopted by HubSpot" },
			to: "Identifying and codifying repeatable deployment patterns, and feeding insight back to product/eng",
			note: "A recurring delivery problem turned into a reusable artifact the vendor referenced in their own docs.",
		},
		{
			from: { label: "Published my delivery method as the Create MVP Claude skill" },
			to: "Building reusable artifacts (agent skills) for an AI-product context",
		},
		{
			from: { label: "90%+ referral / repeat revenue over a decade self-employed" },
			to: "Building long-term customer relationships and surfacing new opportunities",
		},
	],
};

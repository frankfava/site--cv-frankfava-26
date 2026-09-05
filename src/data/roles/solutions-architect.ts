import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";
import { codingYears, yearsIn } from "@/lib/spans";

export const blueprint = buildBlueprint(buildRoleStructure("Solutions Architect"));

export const entry: BlueprintEntry = {
	slug: "solutions-architect",
	title: "Solutions Architect",
	description:
		"I have been the account exec and the engineer in the same room for 160+ projects. Architecture I owned, agentic systems I built and run, and the pre-sales half most architects have never done.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	summary: "The first technical voice a customer hears. Discovery, demos, architecture, business case.",
	slug: entry.slug,
	featuredSkills: ["LARAVEL", "PHP", "VUEJS", "ASTRO", "TYPESCRIPT", "REACT", "AWS", "DOCKER", "CLAUDE", "API", "POSTGRESQL", "FILAMENTPHP"],
	featuredCapabilities: ["cust", "arch", "ai", "code"],
	featuredProjects: ["nas", "hubspot-fieldsjs", "frankenverse-agentic-system", "savr-delta-system", "savr-admin-panels", "ai-skill-create-mvp", "lovable-prompt-builder"],
	featuredCaseStudies: ["savr-admin-panels", "savr-delta-system", "nas", "hubspot-fieldsjs"],
	featuredCertifications: ["testdome-laravel", "testdome-rest-api", "testdome-leadership", "testdome-logical", "testdome-abstract", "testdome-ai"],
	featuredTransferableSkills: ["project-management", "ability-to-lead", "sales-and-business-development", "languages", "team-player"],
	pitch: {
		whyNow: {
			paragraphs: [
				`${codingYears()} years building, the last few freelance, including ${yearsIn("nas")} years owning the architecture and product roadmap as part-time CTO at <a href="/experience#history">National Auto Service</a>. Solutions Architect work is the part I have been doing in fragments my whole career: scoping a customer's actual problem, defending the proposal against the alternatives, and staying with the build until it is a system that survives the renewal.`,
				`Concretely, that means partnering with an account executive to translate a customer's goals into an architecture they'll commit to - serving as the technical advisor across the whole adoption journey, from discovery and evaluation through to deployment, keeping business objectives and technical implementation pointed at the same target the entire way.`,
			],
		},
		lead: "An SA turns a customer's messy reality into a system that ships and then survives. I have spent my career doing the three parts of that separately: designing the system, leading the build, and selling the value.",
		pillars: [
			{
				icon: "ph:robot-duotone",
				title: "I build the agentic systems, I don't just advise on them",
				body: "I run one in production every day: a self-hosted MCP server on a box I administer, with skills and workflows that hold state, scoped tools, guardrails and version-controlled definitions. I have published tooling as well, a Claude Code skill that runs my delivery method and a prompt builder for Lovable. That is the difference between demoing a product and having built one.",
			},
			{
				icon: "ph:blueprint-duotone",
				title: "Architectural ownership, repeatedly",
				body: `Part-time CTO for ${yearsIn("nas")} years at National Auto Service, spear-headed three admin panels and a delta ingestion rebuild that stopped it rewriting every row on every run at SAVR, and was the backend engineer on the integration that put crypto trading into a Stockholm fintech. I have owned the call, not only the diff.`,
			},
			{
				icon: "ph:money-wavy-duotone",
				title: "Pre-sales credibility, partnering with the account team",
				body: "Ran a digital agency for six years and freelanced after it. 160+ projects across about 40 clients, and 1.6M+ SEK billed freelance since 2022. I was the account exec and the engineer in the same room: I defended proposals against bigger competitors, talked customers out of bad ideas, and then had to build whatever I had promised.",
			},
			{
				icon: "ph:stack-duotone",
				title: "Multi-stack, by necessity",
				body: "Production work across Laravel, Vue, React, Astro, HubSpot CMS, WordPress, FilamentPHP, and the SEO and performance plumbing around them. I co-built a HubSpot developer tool that HubSpot's own core team referenced in their documentation.",
			},
			{
				icon: "ph:chats-duotone",
				title: "The same solution, at any altitude",
				body: "Five years as a professional coach before I was a developer, then years of agency selling. I can run an architecture deep-dive with the engineering team and an hour later put the same solution to a CFO as a business case, with both ending up pointed at the same thing.",
			},
		],
		whatTranslates: {
			title: "What translates from freelance & agency work",
			bullets: [
				{ from: "Owning solutions end-to-end as a freelancer", to: "owning the architecture call, not just the diff." },
				{ from: "Defending technical proposals against bigger competitors", to: "pre-sales conversations against alternatives." },
				{ from: "Multi-stack delivery across 160+ projects", to: "solution-shaping that isn't married to a single technology." },
				{ from: "Part-time CTO at NAS", to: "understanding how solutions actually land in a team's workflow, not just on the architecture diagram." },
				{ from: "Five years coaching + agency selling", to: "translating between technical and non-technical stakeholders." },
			],
		},
	},
	mappings: [
		{
			from: { label: "Built + operate a self-hosted MCP server and custom Claude Code agents (Frankenverse)" },
			to: "Architecting real AI / agentic solutions, not just advising on them",
			note: "A production agentic system I run daily. MCP server, scheduled unattended runs, scoped tools and guardrails, which are the concerns an AI-product engagement raises.",
		},
		{
			from: { label: "Published a Claude Code skill (Create MVP) + a Lovable prompt builder" },
			to: "Packaging domain expertise as reusable AI tooling for customers",
			note: "Turned my own delivery method into a skill anyone can run, and shipped tools that help others build with AI.",
		},
		{
			from: { label: `Part-time CTO at National Auto Service (${yearsIn("nas")} years)` },
			to: "Owning architecture under real-world constraints",
			note: "Drove tech strategy, security and delivery for an internal asset-management platform now used across ~90% of Australia.",
		},
		{
			from: { label: "Spear-headed 3 admin panels + data-ingestion delta system at SAVR" },
			to: "Designing systems for performance and operability, not just features",
			note: "Built operability tools for a regulated Stockholm fintech, and rebuilt ingestion so it stopped rewriting every row on every run.",
		},
		{
			from: { label: "Co-created HubSpot FieldsJS - adopted by the core HubSpot team" },
			to: "Cross-vendor / partner-ecosystem credibility",
			note: "Built a developer tool inside another vendor's platform that they ended up referencing in their own docs.",
		},
		{
			from: { label: "Was the account exec and the engineer on 160+ agency deals" },
			to: "Partnering with account executives through the pre-sales motion",
			note: "Qualified the real problem, sized the solution, defended it against bigger competitors, and then had to build what I had promised.",
		},
		{
			from: { label: "5 years as a professional coach, then years of selling my own delivery" },
			to: "Translating between technical and non-technical stakeholders",
		},
		{
			from: { label: "Backend engineer on the crypto-trading integration at a Stockholm fintech" },
			to: "Guiding architecture decisions and integration into a customer's existing tech stack",
		},
	],
};

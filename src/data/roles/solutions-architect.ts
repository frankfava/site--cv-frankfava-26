import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";
import { careerYears, yearsIn } from "@/lib/spans";

export const blueprint = buildBlueprint(buildRoleStructure("Solutions Architect"));

export const entry: BlueprintEntry = {
	slug: "solutions-architect",
	title: "Solutions Architect",
	description:
		"Why I'd be a great Solutions Architect - designing and building real AI/agentic solutions, pre-sales partnership with account executives, technical advisor across the adoption journey, architectural ownership, and a multi-stack track record.",
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
	featuredProjects: ["lovable-output-analyser", "ai-skill-create-mvp", "savr-admin-panels", "lovable-prompt-builder", "savr-delta-system", "nas", "hubspot-fieldsjs"],
	featuredCaseStudies: ["savr-admin-panels", "savr-delta-system", "nas", "hubspot-fieldsjs"],
	featuredCertifications: ["testdome-laravel", "testdome-rest-api", "testdome-leadership", "testdome-logical", "testdome-abstract", "testdome-ai"],
	featuredTransferableSkills: ["project-management", "ability-to-lead", "sales-and-business-development", "languages", "team-player"],
	pitch: {
		whyNow: {
			paragraphs: [
				`After ${careerYears()} years building - the last few freelance, including ${yearsIn("nas")} years owning the architecture and product roadmap as part-time CTO at <a href="/experience#history">National Auto Service</a> - I'm moving deliberately into Solutions Architect work. The pull isn't away from engineering; it's toward the part of the work I've been doing in fragments my whole career: scoping a customer's actual problem, defending the proposal against alternatives, and shepherding the build through to a system that survives the renewal.`,
				`Concretely, that means partnering with an account executive to translate a customer's goals into an architecture they'll commit to - serving as the technical advisor across the whole adoption journey, from discovery and evaluation through to deployment, keeping business objectives and technical implementation pointed at the same target the entire way.`,
			],
		},
		lead: "An SA's job is to translate a customer's messy reality into a system that ships, scales, and survives. That sits at the intersection of three things I've spent my career doing: designing systems, leading the build, and selling the value.",
		pillars: [
			{
				icon: "ph:robot-duotone",
				title: "AI-native, and building it - not just using it",
				body: "I design and run a production agentic system daily: a self-hosted MCP server and custom Claude Code agents I built, with the orchestration, tool use, guardrails and evals that go with them. I've published AI tooling too - a Claude Code skill that productizes my delivery method, and a Lovable prompt builder. For an Solutions Architect, that's the difference between demoing a product and having built one.",
			},
			{
				icon: "ph:blueprint-duotone",
				title: "Architectural ownership, repeatedly",
				body: `Part-time CTO for ${yearsIn("nas")} years at National Auto Service, spear-headed three admin panels and a high-throughput data-ingestion delta system at SAVR, and led the integration that put crypto trading into a Stockholm fintech. I've owned the call, not just the diff.`,
			},
			{
				icon: "ph:money-wavy-duotone",
				title: "Pre-sales credibility, partnering with the account team",
				body: "Ran a digital agency for six years (160+ projects, 1.1M+ SEK billed via Cool Company on a single recent stretch) where I was both the account exec and the engineer in the room. I've defended technical proposals against bigger competitors, talked customers out of bad ideas, and stood by what I shipped - exactly the technical air-cover an AE needs to move a deal.",
			},
			{
				icon: "ph:stack-duotone",
				title: "Multi-stack, not married to one",
				body: "Production work across Laravel, Vue, React, Astro, HubSpot CMS, WordPress, FilamentPHP, Streamlit, and the SEO/perf plumbing around them. I co-built a HubSpot dev tool that the core HubSpot team adopted into their own docs - that's the kind of cross-vendor depth a good SA needs.",
			},
			{
				icon: "ph:chats-duotone",
				title: "Content for every altitude, engineer to executive",
				body: "Five years as a professional coach before I was a developer, plus years of agency selling. I can run an architecture deep-dive with the eng team and, an hour later, frame the same solution as business value for a CFO - leaving both pointed at the same target.",
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
			note: "A production agentic system I run daily - MCP server, autonomous agents, orchestration, guardrails and evals - the exact concerns an AI-product engagement raises.",
		},
		{
			from: { label: "Published a Claude Code skill (Create MVP) + a Lovable prompt builder" },
			to: "Packaging domain expertise as reusable AI tooling for customers",
			note: "Turned my own delivery method into an agent skill, and shipped tools that help others build with AI.",
		},
		{
			from: { label: `Part-time CTO at National Auto Service (${yearsIn("nas")} years)` },
			to: "Owning architecture under real-world constraints",
			note: "Drove tech strategy, security and delivery for an internal asset-management platform now used across ~90% of Australia.",
		},
		{
			from: { label: "Spear-headed 3 admin panels + data-ingestion delta system at SAVR" },
			to: "Designing systems for performance and operability, not just features",
			note: "Built operability tools for a regulated Stockholm fintech and re-architected ingestion to significantly improve performance.",
		},
		{
			from: { label: "Co-created HubSpot FieldsJS - adopted by the core HubSpot team" },
			to: "Cross-vendor / partner-ecosystem credibility",
			note: "Built a developer tool inside another vendor's platform that they ended up referencing in their own docs.",
		},
		{
			from: { label: "Owned a digital agency (FLIC Sites, 160+ projects)" },
			to: "Pre-sales experience defending architecture to non-technical buyers",
			note: "Sold technical work to skeptical SMB owners against larger competitors.",
		},
		{
			from: { label: "Production work across Laravel, Vue, React, Astro, FilamentPHP, HubSpot, WordPress" },
			to: "Solution-shaping that isn't married to a single stack",
		},
		{
			from: { label: "Lead Full-stack Developer at iGoMoon (Stockholm)" },
			to: "Mentoring, code reviews, and complex-project delivery in an agency context",
		},
		{
			from: { label: "5 years as a professional coach + ongoing freelance customer work" },
			to: "Translating between technical and non-technical stakeholders",
		},
		{
			from: { label: "Was the account exec + engineer on 160+ agency deals" },
			to: "Partnering with account executives through the pre-sales motion",
			note: "Qualified the real problem, sized the solution, and carried the technical conversation alongside the commercial one.",
		},
		{
			from: { label: "Scoped → built → handed over across discovery to deployment" },
			to: "Serving as technical advisor across the full adoption journey",
			note: "Discovery, evaluation, PoC and deployment - owned end-to-end rather than thrown over a wall.",
		},
		{
			from: { label: "Led the crypto-trading integration into a Stockholm fintech's stack" },
			to: "Guiding architecture decisions and integration into a customer's existing tech stack",
		},
		{
			from: { label: "Built evaluations and PoCs to prove an approach before commitment" },
			to: "Helping customers evaluate frameworks against their specific use case",
		},
	],
};

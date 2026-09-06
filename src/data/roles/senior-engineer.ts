import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";
import { codingYears, yearsIn } from "@/lib/spans";
import { inWords } from "@/utils/number";

export const blueprint = buildBlueprint(buildRoleStructure("Senior Engineer"));

export const entry: BlueprintEntry = {
	slug: "senior-engineer",
	title: "Senior Engineer",
	description: "Multi-stack production depth, a habit of building the tool when the work repeats, and the architecture call as well as the diff.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	summary: `${inWords(codingYears(), "Sentence")} years of it. I still want the keyboard, and I want a say in what gets built with it.`,
	slug: entry.slug,
	featuredSkills: ["LARAVEL", "PHP", "VUEJS", "TYPESCRIPT", "ASTRO", "POSTGRESQL", "DOCKER", "API", "CLAUDE", "FILAMENTPHP", "TERRAFORM"],
	featuredCapabilities: ["code", "arch", "ai", "cust"],
	featuredProjects: ["nas", "savr-delta-system", "savr-admin-panels", "hubspot-fieldsjs", "ai-skill-create-mvp"],
	featuredCaseStudies: ["nas", "savr-delta-system", "savr-admin-panels", "hubspot-fieldsjs"],
	featuredCertifications: ["testdome-laravel", "testdome-rest-api", "testdome-leadership", "testdome-logical", "testdome-abstract", "testdome-ai"],
	featuredTransferableSkills: ["ability-to-lead", "project-management", "team-player", "coaching-skills"],
	pitch: {
		lead: `${codingYears()} years building, multi-stack. Most recently Senior Software Engineer at SAVR, a Stockholm fintech, where I shipped three production admin panels and a delta ingestion rebuild that stopped it rewriting every row on every run. I ship production code in Laravel, Vue, React and Astro, and I own the architecture call when it matters.`,
		pillars: [
			{
				icon: "ph:hammer-duotone",
				title: "Senior production engineering",
				body: "At SAVR I spear-headed three admin panels, shipped a delta ingestion rebuild that stopped it rewriting every row on every run, and was the primary backend developer on the crypto-trading integration. Production work across Laravel, Vue, React, Astro, HubSpot CMS, WordPress, FilamentPHP, and the SEO/perf plumbing around them.",
			},
			{
				icon: "ph:package-duotone",
				title: "Tool-builder mindset",
				body: 'Co-built <code class="rounded bg-sunk px-1 text-ink">@iGoMoon/hubspot-fields-js</code>, an open-source developer tool that the HubSpot core team referenced in their official Fields.JS documentation. I have also published my delivery method as a Claude Code skill. When the work repeats, I build the tool.',
			},
			{
				icon: "ph:users-three-duotone",
				title: "Technical leadership where it counts",
				body: `Lead Full-stack Developer at iGoMoon, running code reviews and retros, sitting in on hiring, and training junior developers. Part-time CTO at National Auto Service for ${yearsIn("nas")} years, owning architecture, security and delivery for a platform now used across ~90% of Australia.`,
			},
			{
				icon: "ph:sparkle-duotone",
				title: "I use it every day and I built some of it",
				body: "Claude Code daily, with Cursor alongside it. I have published two tools of my own, a skill that runs an MVP from discovery to implementation and a prompt builder for Lovable. I also know which jobs it is still worse at than I am.",
			},
		],
	},
	mappings: [
		{
			from: { label: `Part-time CTO at National Auto Service (${yearsIn("nas")} years)` },
			to: "Owning architecture in production, not just shipping features",
			note: "Drove tech strategy, security and delivery for an internal asset-management platform now used across ~90% of Australia.",
		},
		{
			from: { label: "Designed and built a delta ingestion system at SAVR" },
			to: "Performance engineering on real production constraints",
			note: "Rebuilt ingestion at a regulated Stockholm fintech so it compares against what is stored and writes only what changed.",
		},
		{
			from: { label: "Co-created HubSpot FieldsJS - adopted by the core HubSpot team" },
			to: "Tool-builder mindset; reusable engineering across customer projects",
			note: "Built a dev tool inside another vendor's platform that they ended up referencing in their own docs.",
		},
		{
			from: { label: "Lead Full-stack Developer at iGoMoon (Stockholm digital agency)" },
			to: "Technical leadership - code reviews, mentoring, hiring",
			note: "Trained junior developers, ran retros and code reviews, sat in on hiring rounds, and wrote the coding standard.",
		},
		{
			from: { label: "AI-native workflow: Claude Code + Cursor + published custom skills" },
			to: "Modern engineering toolkit applied as a real practice",
			note: "Built and published `ai-skill--create-mvp` and `app--lovable-prompt-builder`, and I run agents in production every day.",
		},
		{
			from: { label: `${codingYears()} years building, Sydney to Stockholm, agency to freelance to product` },
			to: "Seasoned, picks up new tech quickly, ships on real deadlines",
		},
	],
};

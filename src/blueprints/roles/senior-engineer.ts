import { buildRoleStructure } from ".";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/data/roleDefinitions";

export const blueprint = buildBlueprint(buildRoleStructure("Senior Engineer"));

export const entry: BlueprintEntry = {
	slug: "senior-engineer",
	title: "Senior Engineer",
	description: "Why I'd be a great Senior Engineer - multi-stack production depth, tool-builder mindset, and technical leadership.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	slug: entry.slug,
	featuredSkills: ["LARAVEL", "PHP", "VUEJS", "TYPESCRIPT", "ASTRO", "POSTGRESQL", "DOCKER", "API", "CLAUDE", "FILAMENTPHP", "TERRAFORM"],
	featuredProjects: ["nas", "hubspot-fieldsjs", "ai-skill-create-mvp"],
	featuredCertifications: ["testdome-laravel", "testdome-rest-api", "testdome-leadership", "testdome-logical", "testdome-abstract", "testdome-ai"],
	featuredTransferableSkills: ["ability-to-lead", "project-management", "team-player", "coaching-skills"],
	pitch: {
		lead: "18 years building, multi-stack, with the last decade in modern web. Most recent: Senior Software Engineer at SAVR (Stockholm fintech) - three production admin panels and a delta ingestion system that significantly improved performance. Comfortable shipping production code in Laravel, Vue, React, Astro - and comfortable owning the architecture call when it matters.",
		pillars: [
			{
				icon: "ph:hammer-duotone",
				title: "Senior production engineering",
				body: "At SAVR I spear-headed three admin panels (FilamentPHP + Streamlit), shipped a delta ingestion system that significantly improved performance, and was the primary backend developer on the crypto-trading integration. Production work across Laravel, Vue, React, Astro, HubSpot CMS, WordPress, FilamentPHP, and the SEO/perf plumbing around them.",
			},
			{
				icon: "ph:package-duotone",
				title: "Tool-builder mindset",
				body: 'Co-built <code class="rounded bg-sunk px-1 text-ink">@iGoMoon/hubspot-fields-js</code> - an open-source dev tool that the HubSpot core team adopted into their official Fields.JS docs. Productised my consulting methodology as a Claude Code skill. When repetition hurts, I build the tool.',
			},
			{
				icon: "ph:users-three-duotone",
				title: "Technical leadership where it counts",
				body: "Lead Full-stack Developer at iGoMoon - ran code reviews, retros, hiring panels, and trained junior developers. Part-time CTO at National Auto Service for nearly 4 years - owned architecture, security, and delivery for a platform now used across ~90% of Australia.",
			},
			{
				icon: "ph:sparkle-duotone",
				title: "AI-native delivery, not as a buzzword",
				body: "Daily Claude Code + Cursor user. Published two AI-tooling projects - an MVP-workflow skill and a Lovable prompt builder. AI is part of the toolkit, not a magic wand - including knowing when not to use it.",
			},
		],
	},
	mappings: [
		{
			from: { label: "Part-time CTO at National Auto Service (nearly 4 years)" },
			to: "Owning architecture in production, not just shipping features",
			note: "Drove tech strategy, security and delivery for an internal asset-management platform now used across ~90% of Australia.",
		},
		{
			from: { label: "Designed and built a delta ingestion system at SAVR" },
			to: "Performance engineering on real production constraints",
			note: "Re-architected ingestion from full-source pulls to delta - significant performance improvement on a regulated Stockholm fintech.",
		},
		{
			from: { label: "Co-created HubSpot FieldsJS - adopted by the core HubSpot team" },
			to: "Tool-builder mindset; reusable engineering across customer projects",
			note: "Built a dev tool inside another vendor's platform that they ended up referencing in their own docs.",
		},
		{
			from: { label: "Lead Full-stack Developer at iGoMoon (Stockholm digital agency)" },
			to: "Technical leadership - code reviews, mentoring, hiring",
			note: "Trained junior developers, ran retros and code reviews, sat in on hiring rounds, contributed to coding standards.",
		},
		{
			from: { label: "Production work across Laravel, Vue, React, Astro, FilamentPHP, HubSpot, WordPress" },
			to: "Adaptable across stacks, not married to a single framework",
		},
		{
			from: { label: "AI-native workflow: Claude Code + Cursor + published custom skills" },
			to: "Modern engineering toolkit applied as a real practice",
			note: "Built and published `ai-skill--create-mvp` and `app--lovable-prompt-builder`. AI as part of the toolkit, not a buzzword.",
		},
		{
			from: { label: "18 years building - Sydney → Stockholm, agency → freelance → product" },
			to: "Seasoned, picks up new tech quickly, ships on real deadlines",
		},
	],
};

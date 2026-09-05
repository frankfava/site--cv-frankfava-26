import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";

export const blueprint = buildBlueprint(buildRoleStructure("Technical Evangelist"));

export const entry: BlueprintEntry = {
	slug: "technical-evangelist",
	title: "Technical Evangelist",
	description: "Why I'd be a great Technical Evangelist - coaching, sales, and a decade of hands-on engineering.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	enabled: false,
	summary: "Coaching, sales, and a decade of hands-on engineering.",
	slug: entry.slug,
	featuredSkills: ["CLAUDE", "GPT", "ASTRO", "REACT", "TYPESCRIPT", "TAILWIND", "LARAVEL", "GITHUB"],
	featuredProjects: ["hubspot-fieldsjs", "lovable-output-analyser", "ai-skill-create-mvp", "lovable-prompt-builder", "this-cv"],
	featuredCertifications: ["ici-cert-coaching", "ici-cert-nlp", "testdome-people", "testdome-leadership", "testdome-ai"],
	featuredTransferableSkills: ["coaching-skills", "sales-and-business-development", "customer-service", "languages", "ability-to-lead"],
	pitch: {
		lead: "A Technical Evangelist's job is to make complex technology feel obvious, exciting, and worth adopting. That sits exactly at the intersection of three things I've spent my career doing.",
		pillars: [
			{
				icon: "ph:code-duotone",
				title: "A real builder, not a presenter pretending",
				body: "Over a decade hands-on with web platforms - Laravel, Vue, Astro, the WordPress ecosystem, and the SEO/performance plumbing around them. I've shipped products as a freelancer, a lead developer, and a part-time CTO. When I demo a tool, I've used it under real constraints, not just read the docs.",
			},
			{
				icon: "ph:chalkboard-teacher-duotone",
				title: "Five years as a professional coach before I was a developer",
				body: "I ran a personal coaching practice from 2010-2015 and learned how to actually move someone from confused to confident. That's the core skill of evangelism - helping people see what they couldn't see before.",
			},
			{
				icon: "ph:money-wavy-duotone",
				title: "Sales without the sleaze",
				body: "Running a digital agency meant I had to sell - to skeptical buyers, on technical merit, against bigger competitors. I learned how to articulate value to non-technical stakeholders and stand by what I shipped.",
			},
			{
				icon: "ph:ice-cream-duotone",
				title: "Customer empathy as a default",
				body: "Years of agency work and customer service taught me that the audience's frustration is signal, not noise. Evangelism is downstream of listening.",
			},
		],
	},
	mappings: [
		{
			from: { label: "Co-created HubSpot FieldsJS - adopted by the core HubSpot team" },
			to: "Evidence of dev-tool DX impact at scale",
			note: "Built a tool to speed up HubSpot module dev; HubSpot's own docs ended up referencing it.",
		},
		{
			from: { label: "5 years as a personal coach (Relationships Revealed)" },
			to: "Ability to move people from confused → confident",
			note: "The core skill of evangelism - done full-time before I ever wrote production code.",
		},
		{
			from: { label: "Owned a digital agency for ~6 years (FLIC Sites, 160+ projects)" },
			to: "Sales credibility with technical buyers",
			note: "Sold on technical merit to skeptical SMB owners - the Lovable customer profile.",
		},
		{
			from: { label: "Lead Developer at iGoMoon (Stockholm digital agency)" },
			to: "Trusted technical voice in agency / partner ecosystems",
			note: "Trained team, ran retros and code reviews, sat in on hiring.",
		},
		{
			from: { label: "AI-native workflow: Claude Code + Cursor + custom skills" },
			to: "Authentic, current familiarity with the AI-app-builder stack",
			note: "Built and published `ai-skill--create-mvp` and `app--lovable-prompt-builder`.",
		},
		{
			from: { label: "Senior Software Engineer at SAVR (Stockholm fintech)" },
			to: "Production engineering credibility",
			note: "Spear-headed three admin panels and a delta ingestion rebuild that stopped it rewriting every row on every run.",
		},
		{
			from: { label: "Workshops, seminars and webinars (Relationships Revealed + iGoMoon)" },
			to: "Comfortable on stage, on camera, and in front of a live audience",
		},
	],
};

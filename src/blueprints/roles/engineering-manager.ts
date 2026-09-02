import { buildRoleStructure } from ".";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/data/roleDefinitions";

export const blueprint = buildBlueprint(buildRoleStructure("Engineering Manager"));

export const entry: BlueprintEntry = {
	slug: "engineering-manager",
	title: "Engineering Manager",
	description:
		"Why I'd be a great Engineering Manager: coaching as the core skill, a track record leading and growing engineers, ownership of technical direction and delivery, and the technical credibility to lead from the front.",
	blueprint,
	config: {
		search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	slug: entry.slug,
	featuredSkills: ["LARAVEL", "PHP", "VUEJS", "TYPESCRIPT", "AWS", "DOCKER", "CLAUDE", "API", "POSTGRESQL", "FILAMENTPHP"],
	featuredProjects: ["nas", "savr-admin-panels", "ai-skill-create-mvp"],
	featuredCaseStudies: ["nas", "savr-admin-panels"],
	featuredCertifications: ["ici-cert-leadership", "ici-cert-coaching", "testdome-leadership", "testdome-people", "testdome-ai"],
	featuredTransferableSkills: ["coaching-skills", "ability-to-lead", "project-management", "team-player"],
	pitch: {
		whyNow: {
			paragraphs: [
				`After 18 years building software, Engineering Manager is where my two careers meet. Before I was a developer I spent five years as a professional coach. Management isn't a pivot away from what I'm good at. It's the thread that has run through every engineering role I've had, from training juniors to owning delivery as a part-time CTO, made the main job.`,
				`Concretely: I've led and grown developers, run code reviews and retros, contributed to hiring, and owned the technical direction and delivery of production systems as a part-time CTO. The move into EM makes the people-and-delivery half of that work the centre of the role, while staying close enough to the code to keep a team's trust.`,
			],
		},
		lead: "An EM's job is to build a team that ships: growing engineers, creating clarity, and keeping delivery healthy while staying technically credible. That sits at the intersection of the two things I've spent longest doing: leading engineering work, and coaching people to be better at theirs.",
		pillars: [
			{
				icon: "ph:hand-heart-duotone",
				title: "Coaching is the core skill, not a management veneer",
				body: "Five years as a professional coach before I was a developer. Growing people through 1:1s, honest feedback and career conversations isn't a skill I'm picking up for the title. It's my original craft, now pointed at engineers.",
			},
			{
				icon: "ph:users-three-duotone",
				title: "Leading engineers, not just projects",
				body: "Lead Full-stack Developer at iGoMoon, where I ran code reviews and retros, trained junior developers, and contributed to hiring, including the coding task used to screen candidates. At National Auto Service I brought in, managed and trained a small dev team through larger builds.",
			},
			{
				icon: "ph:blueprint-duotone",
				title: "Owning technical direction and delivery",
				body: "Part-time CTO at National Auto Service for nearly four years. Owned architecture, security, sprint delivery and product strategy for a platform now used across ~90% of Australia. I set the direction and stayed accountable for what shipped, not just for my own diffs.",
			},
			{
				icon: "ph:sparkle-duotone",
				title: "Technically credible, and AI-native",
				body: "18 years and multi-stack (Laravel, Vue, React, Astro), most recently Senior Software Engineer at SAVR. Daily Claude Code + Cursor user who's published AI tooling. I lead from technical credibility, and I know where AI genuinely helps a team ship and where it doesn't.",
			},
		],
		whatTranslates: {
			title: "What translates into engineering management",
			bullets: [
				{ from: "Five years as a professional coach before I wrote code", to: "growing individuals through 1:1s, feedback and career development." },
				{ from: "Trained juniors and built the hiring screen at iGoMoon", to: "hiring, onboarding, and raising the bar of a team." },
				{ from: "Part-time CTO owning delivery at National Auto Service", to: "owning a team's priorities, delivery health and technical direction." },
				{ from: "Brought in and managed a temporary dev team through larger builds", to: "coordinating and unblocking engineers to hit a deadline." },
				{ from: "18 years shipping multi-stack production code", to: "the technical credibility to lead engineers and earn their trust." },
			],
		},
	},
	mappings: [
		{
			from: { label: "Lead Full-stack Developer at iGoMoon (Stockholm digital agency)", url: "/#history" },
			to: "Leading, mentoring and growing a team of engineers",
			note: "Ran code reviews and retros, trained junior developers, and contributed to hiring, including the coding task used to screen candidates.",
		},
		{
			from: { label: "Five years as a professional coach before I was a developer", url: "/#history" },
			to: "The people-development core of engineering management",
			note: "The 1:1s, feedback and career-growth work an EM lives on is my original profession.",
		},
		{
			from: { label: "Part-time CTO at National Auto Service (nearly 4 years)", url: "/#history" },
			to: "Owning a team's technical direction, delivery and priorities",
			note: "Set architecture, security and product strategy and stayed accountable for delivery on a platform now used across ~90% of Australia.",
		},
		{
			from: { label: "Brought in, managed and trained a temporary dev team for larger builds", url: "/#history" },
			to: "Coordinating engineers and unblocking delivery under a deadline",
		},
		{
			from: { label: "Multi-stack production work + Senior Software Engineer at SAVR", url: "/#technical" },
			to: "Technical credibility to lead engineers, not just administer them",
			note: "I can run an architecture discussion and review at a high bar, which is what earns a strong team's trust.",
		},
		{
			from: { label: "AI-native workflow: daily Claude Code + Cursor, published custom skills", url: "/#history" },
			to: "Championing AI-assisted engineering within a team",
			note: "First-hand practice with agentic coding tools, the exact capability the current wave of AI-forward EM roles asks a leader to bring.",
		},
	],
};

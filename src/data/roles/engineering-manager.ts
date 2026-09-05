import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";
import { codingYears, yearsIn } from "@/lib/spans";
import { inWords } from "@/utils/number";

export const blueprint = buildBlueprint(buildRoleStructure("Engineering Manager"));

export const entry: BlueprintEntry = {
	slug: "engineering-manager",
	title: "Engineering Manager",
	description:
		"Coaching was my first profession and engineering came second. Leading engineers since 2020, owning technical direction and delivery as a part-time CTO, and still close enough to the code to keep a team's trust.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	summary: "Coaching was my first profession. Engineering came second, and this role is where the two meet.",
	slug: entry.slug,
	featuredSkills: ["LARAVEL", "PHP", "VUEJS", "TYPESCRIPT", "AWS", "DOCKER", "CLAUDE", "API", "POSTGRESQL", "FILAMENTPHP"],
	featuredCapabilities: ["lead", "arch", "code", "ai"],
	featuredProjects: ["nas", "savr-admin-panels", "ai-skill-create-mvp"],
	featuredCaseStudies: ["nas", "savr-admin-panels"],
	featuredCertifications: ["ici-cert-leadership", "ici-cert-coaching", "testdome-leadership", "testdome-people", "testdome-ai"],
	featuredTransferableSkills: ["coaching-skills", "ability-to-lead", "project-management", "team-player"],
	pitch: {
		whyNow: {
			paragraphs: [
				`Engineering Manager is where my two careers meet. I coached professionally for five years before software paid me anything, and I have spent the ${codingYears()} years since building it. Management has been the thread through every engineering role I have had, from training juniors to owning delivery as a part-time CTO. This role makes that the job rather than the part I fit around the code.`,
				`Concretely: I've led and grown developers, run code reviews and retros, contributed to hiring, and owned the technical direction and delivery of production systems as a part-time CTO. The move into EM makes the people-and-delivery half of that work the centre of the role, while staying close enough to the code to keep a team's trust.`,
			],
		},
		lead: "An EM builds a team that ships and keeps it healthy, while staying technically credible enough that the team listens. Those are the two things I have spent longest doing: leading engineering work, and coaching people to be better at theirs.",
		pillars: [
			{
				icon: "ph:hand-heart-duotone",
				title: "Coaching is my original craft",
				body: "Five years of it professionally before I was a developer, and an ICI Advanced Practitioner of Executive and Leadership Coaching. The 1:1s, the honest feedback and the career conversations are the work I trained in, now pointed at engineers.",
			},
			{
				icon: "ph:users-three-duotone",
				title: "Leading engineers, not just projects",
				body: "Lead Full-stack Developer at iGoMoon, where I ran code reviews and retros, trained junior developers, and contributed to hiring, including the coding task used to screen candidates. At National Auto Service I brought in, managed and trained a small dev team through larger builds.",
			},
			{
				icon: "ph:blueprint-duotone",
				title: "Owning technical direction and delivery",
				body: `Part-time CTO at National Auto Service for ${inWords(yearsIn("nas"))} years. Owned architecture, security, sprint delivery and product strategy for a platform now used across ~90% of Australia. I set the direction and stayed accountable for what shipped, not just for my own diffs.`,
			},
			{
				icon: "ph:sparkle-duotone",
				title: "Technically credible, and I run the AI myself",
				body: `${codingYears()} years multi-stack across Laravel, Vue, React and Astro, most recently Senior Software Engineer at SAVR. Claude Code daily, and agents I built and run in production. I lead from technical credibility, and I know where AI helps a team ship and where it does not.`,
			},
		],
		whatTranslates: {
			title: "What translates into engineering management",
			bullets: [
				{ from: "Five years as a professional coach before I wrote code", to: "growing individuals through 1:1s, feedback and career development." },
				{ from: "Trained juniors and built the hiring screen at iGoMoon", to: "hiring, onboarding, and raising the bar of a team." },
				{ from: "Part-time CTO owning delivery at National Auto Service", to: "owning a team's priorities, delivery health and technical direction." },
				{ from: "Brought in and managed a temporary dev team through larger builds", to: "coordinating and unblocking engineers to hit a deadline." },
				{ from: `${codingYears()} years building multi-stack code`, to: "the technical credibility to lead engineers and earn their trust." },
			],
		},
	},
	mappings: [
		{
			from: { label: "Lead Full-stack Developer at iGoMoon (Stockholm digital agency)" },
			to: "Leading, mentoring and growing a team of engineers",
			note: "Ran code reviews and retros, trained junior developers, and contributed to hiring, including the coding task used to screen candidates.",
		},
		{
			from: { label: "Five years as a professional coach before I was a developer" },
			to: "The people-development core of engineering management",
			note: "The 1:1s, feedback and career-growth work an EM lives on is my original profession.",
		},
		{
			from: { label: `Part-time CTO at National Auto Service (${yearsIn("nas")} years)` },
			to: "Owning a team's technical direction, delivery and priorities",
			note: "Set architecture, security and product strategy and stayed accountable for delivery on a platform now used across ~90% of Australia.",
		},
		{
			from: { label: "Brought in, managed and trained a temporary dev team for larger builds" },
			to: "Coordinating engineers and unblocking delivery under a deadline",
		},
		{
			from: { label: "Multi-stack production work + Senior Software Engineer at SAVR" },
			to: "Technical credibility to lead engineers, not just administer them",
			note: "I can run an architecture discussion and review at a high bar, which is what earns a strong team's trust.",
		},
		{
			from: { label: "AI-native workflow: daily Claude Code + Cursor, published custom skills" },
			to: "Championing AI-assisted engineering within a team",
			note: "First-hand practice with agentic coding tools, which is what the AI-forward EM roles are asking a leader to bring.",
		},
	],
};

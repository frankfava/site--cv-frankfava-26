import { buildRoleStructure } from "../blueprints/role";
import { buildBlueprint } from "@/lib/blueprints";
import type { BlueprintEntry } from "@/lib/blueprints";
import type { RoleDefinition } from "@/lib/roles";
import { codingYears, yearsIn } from "@/lib/spans";

export const blueprint = buildBlueprint(buildRoleStructure("AI Enablement Lead"));

export const entry: BlueprintEntry = {
	slug: "ai-enablement-lead",
	title: "AI Enablement Lead",
	description:
		"Teaching people to use a technology was my profession before I wrote code. Now the technology is AI, I build and run it myself, and I have had to write the guardrails for a system I depend on.",
	blueprint,
	config: {
		// search: { enabled: false },
		layout: { showSidebar: false, showFooter: true },
	},
};

export const definition: RoleDefinition = {
	summary: "Getting an organisation to actually use AI, and writing the rules that let it move fast safely.",
	slug: entry.slug,
	featuredSkills: ["CLAUDE", "MCP", "AGENTIC", "PROMPTENG", "GPT", "LOVABLE", "DOCKER", "ANSIBLE", "API", "GITHUB"],
	featuredCapabilities: ["ai", "lead", "arch", "code"],
	featuredProjects: ["frankenverse-agentic-system", "ai-skill-create-mvp", "lovable-prompt-builder", "lovable-output-analyser", "nas", "hubspot-fieldsjs"],
	featuredCaseStudies: ["nas", "hubspot-fieldsjs"],
	featuredCertifications: ["ici-cert-coaching", "ici-cert-leadership", "ici-cert-nlp", "testdome-ai", "testdome-people", "testdome-leadership"],
	featuredTransferableSkills: ["coaching-skills", "ability-to-lead", "project-management", "customer-service", "team-player"],
	pitch: {
		whyNow: {
			paragraphs: [
				`Enablement is a teaching job with an engineering problem underneath it, and I have done both halves for a living. I spent five years as a professional coach before software paid me anything, running seminars, webinars and facilitated workshops and building a ten-week course. Then ${codingYears()} years engineering, the last ${yearsIn("nas")} of them owning product direction as part-time CTO at <a href="/experience#history">National Auto Service</a>.`,
				`What makes this the right seat now is that I am not enabling a technology I read about. I build and operate agentic systems daily, and I have had to decide what they are allowed to touch, which model runs them, and how a change to an agent gets reviewed before it ships. Adoption fails on the second month, not the first, and the reason is usually that nobody wrote the rules or stayed around to answer questions.`,
			],
		},
		lead: "Enablement needs three things at once: someone who can teach, someone the engineers take seriously, and someone willing to write the policy nobody wants to own. I have done all three, and I run the AI myself rather than advising from the outside.",
		pillars: [
			{
				icon: "ph:chalkboard-teacher-duotone",
				title: "Teaching adults a practice is my original craft",
				body: "Five years as a professional coach before I was a developer, and an ICI Advanced Practitioner of Executive and Leadership Coaching. I delivered in-person seminars, online webinars and facilitated workshops to rooms of people, and built a ten-week course run partly self-directed and partly one to one. At iGoMoon I ran the internal trainings that kept the development team current. Getting people to keep using something after the novelty wears off is the actual job, and it is the one I trained in.",
			},
			{
				icon: "ph:robot-duotone",
				title: "I run the AI I would be enabling",
				body: "A self-hosted agentic system I operate every day as a real dependency: my own MCP server, custom agents and skills that take real actions unattended on a schedule. I am not demonstrating a tool I evaluated. I am describing the one I depend on, which is a different kind of credibility in front of engineers.",
			},
			{
				icon: "ph:shield-check-duotone",
				title: "Governance I have had to write, not read",
				body: "I own the guardrails on that system: which tools an agent can reach, which model runs it, what is scoped away, and how a change to an agent definition gets reviewed before it takes effect. Writing rules that let something move quickly without breaking is a different exercise when you are the one it breaks for.",
			},
			{
				icon: "ph:translate-duotone",
				title: "Between the business and the engineers, in the same day",
				body: `Product Owner and part-time CTO at National Auto Service for ${yearsIn("nas")} years, driving product from idea to finished solution with a dev team I brought in and managed. Before that, five years running my own agency across 160+ projects as the person selling the work and the person building it. Translating what a business wants into what an engineer should do is the ordinary shape of my week, not a skill I would be learning here.`,
			},
		],
		whatTranslates: {
			title: "What translates into AI enablement",
			bullets: [
				{ from: "Five years delivering seminars, webinars and workshops as a professional coach", to: "running the training and workshops that make adoption land." },
				{ from: "A ten-week course, part self-directed and part one to one", to: "building enablement material people finish rather than bookmark." },
				{ from: "Internal trainings at iGoMoon to keep a dev team current", to: "an AI champions programme and day-to-day support inside an engineering org." },
				{ from: "Guardrails, tool scoping and change control on my own agentic system", to: "usage policy, access rules and standards that survive contact with a deadline." },
				{ from: "Part-time CTO and Product Owner at National Auto Service", to: "coordinating agent and internal-tool builds with engineers." },
				{ from: "Publishing my delivery method as a Claude Code skill anyone can run", to: "turning what works into something the rest of the organisation can pick up." },
			],
		},
	},
	mappings: [
		{
			from: { label: "Five years as a professional coach: seminars, webinars, facilitated workshops, a 10-week course" },
			to: "Running the training and workshops that make AI adoption stick",
			note: "Teaching adults a practice and keeping them at it was my profession before software. Enablement is that job with a different subject.",
		},
		{
			from: { label: "Built + operate a self-hosted MCP server and custom Claude Code agents (Frankenverse)" },
			to: "Being genuinely AI-native rather than AI-curious",
			note: "A production agentic system I run daily. Unattended scheduled runs, scoped tools, version-controlled agent definitions.",
		},
		{
			from: { label: "Own the guardrails, tool scoping, model selection and change control on that system" },
			to: "Drafting and operationalising usage guidelines, access policies and guardrails",
			note: "The governance half of enablement, written for a system where I am the one who pays if the rules are wrong.",
		},
		{
			from: { label: "Ran internal trainings at iGoMoon; built the KPI tool team leads used, with the CFO" },
			to: "Building an internal champions programme and the day-to-day support around it",
			note: "Enablement inside an engineering org, including the unglamorous part where you build the thing people actually open.",
		},
		{
			from: { label: `Product Owner and part-time CTO at National Auto Service (${yearsIn("nas")} years)` },
			to: "Coordinating agent and internal-tool builds with engineers",
			note: "Drove product from idea to finished solution, including custom requirements and backlog, with a dev team I brought in and managed.",
		},
		{
			from: { label: "Published a Claude Code skill (Create MVP) and a Lovable prompt builder + output analyser" },
			to: "Packaging AI capability into something other people can run",
			note: "Turned my own method into a skill anyone can use, and shipped low-code tooling that helps others build with AI.",
		},
		{
			from: { label: "Was the account exec and the engineer on 160+ agency projects" },
			to: "Translating between business needs and technical direction",
		},
		{
			from: { label: "Co-created HubSpot FieldsJS - referenced by HubSpot in their own documentation" },
			to: "Getting an organisation to adopt a way of working that wasn't theirs",
		},
	],
};

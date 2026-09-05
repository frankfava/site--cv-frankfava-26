/**
 * Problems I have actually been handed, each answered with the real
 * engagement rather than a hypothetical.
 */
import type { _Card } from "@/types";
import { startYearOf, yearsIn } from "@/lib/spans";

export interface Scenario extends _Card {
	card: _Card;
	proof: Array<{ figure: string; note: string }>;
}

export const SCENARIOS: Scenario[] = [
	{
		key: "ops",
		card: {
			eyebrow: "Operations",
			title: "Everything goes through phone calls. Our customers can't see anything themselves.",
		},
		eyebrow: `National Auto Service · ${startYearOf("nas")} to now`,
		title: "I traced where the cash was getting stuck before I drew a single schema.",
		body: "A customer brings a truck that needs work, NAS finds a mechanic, the mechanic reports back. All of it lived in phone calls and spreadsheets. What exists now is one domain model with three surfaces on it: internal operations, a customer portal and a contractor portal. I argued the security, integrity and roadmap decisions in front of a CEO measured on fleet uptime, not architecture, and I'm still the one who gets called when it breaks.",
		proof: [
			{ figure: "3", note: "surfaces on one domain model" },
			{ figure: "Cashflow", note: "improved, in the CEO's words" },
			{ figure: `${yearsIn("nas")} yrs`, note: "and still accountable" },
		],
	},
	{
		key: "team",
		card: {
			eyebrow: "Team",
			title: "Our juniors ship, but every project is built a different way.",
		},
		eyebrow: "iGoMoon · Stockholm agency, 2020 to 2022",
		title: "I ran the reviews, then wrote the task we screened candidates with.",
		body: "Six months in I was made lead developer, with a team of juniors to bring up. The code review became the training: retrospectives, workshops, and a written standard in the company knowledge base. I sat in with the CTO on hiring and wrote the coding task every candidate worked through, so they all met the same bar. I built the KPI app the team tracked itself with, and before I left I was brought into the group that set the company's direction.",
		proof: [
			{ figure: "6 mo", note: "to lead developer" },
			{ figure: "Coding task", note: "used to screen candidates" },
		],
	},
	{
		key: "agents",
		card: {
			eyebrow: "AI",
			title: "We want agents in front of customers and we don't know where to start.",
		},
		eyebrow: "Frankenverse · running daily since Feb 2026",
		title: "Almost everyone has run an agent. Almost nobody has run one unattended for months.",
		body: "That gap is the whole engineering problem, and it's where I've spent this year. My own knowledge base is wired to Claude through a self-hosted MCP server on a VPS I administer, encrypted at rest, with skills and workflows that do the everyday work and hold state across sessions. Explicit tool scopes, guardrails, per-task model selection, definitions under version control, and scheduled headless runs with nobody watching. When a scheduled run collided with sync and split twelve files, I found it and fixed it.",
		proof: [
			{ figure: "Self-hosted", note: "MCP server I administer" },
			{ figure: "Unattended", note: "scheduled runs" },
		],
	},
	{
		key: "presales",
		card: {
			eyebrow: "Pre-sales",
			title: "We need someone who can sell the architecture, not just draw it.",
		},
		eyebrow: "FLIC Sites and freelance · 160+ projects",
		title: "Customers arrive with a solution already chosen. The job is finding the problem it was meant to solve.",
		body: "Every project started with me in a room arguing a proposal against agencies with more people and better decks. I quoted work, lost some of it, and learned why, because scoping to win is how you lose money on delivery. And there was no handover to a delivery team: what I promised in the room is what I then had to make exist, which is a very effective discipline on what you promise. Over a million of that came from one client who kept renewing.",
		proof: [
			{ figure: "160+", note: "sold and delivered" },
			{ figure: "~40", note: "clients they were spread across" },
			{ figure: "1.6M+", note: "SEK billed freelance" },
		],
	},
	{
		key: "enablement",
		card: {
			eyebrow: "Enablement",
			title: "Everyone here is using AI and nothing ships any faster.",
		},
		eyebrow: "Create MVP · published Jan 2026",
		title: "It takes an idea to a working MVP, and picks up where it left off.",
		body: "A Claude Code skill that runs discovery, then planning, then implementation, so anyone can get an idea to a working MVP instead of one-shotting it at a blank prompt. State persists between sessions, so a build resumes where it stopped. Six hours from method to published skill. It allows anyone to build an advanced tool or application in order to test an idea and ship faster",
		proof: [
			{ figure: "6 hrs", note: "method to published skill" },
			{ figure: "Resumable", note: "state survives the session" },
		],
	},
	{
		key: "pipeline",
		card: {
			eyebrow: "Data",
			title: "Our pipeline is buckling and nobody wants to touch it.",
		},
		eyebrow: "SAVR · Stockholm fintech, 2025 to 2026",
		title: "It rewrote every row on every run. I made it write only the rows that had changed.",
		body: "Every run pulled the whole source and then overwrote the whole database, so every row was rewritten whether anything about it had changed or not. The run took about three hours. I kept the pull, cached it and compared it against what was already stored, which left only the writes that were a real change.",
		proof: [
			{ figure: "Delta writes", note: "instead of rewriting everything" },
			{ figure: "3", note: "admin panels still in use" },
		],
	},
];

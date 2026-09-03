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
			{ figure: "~90%", note: "of Australia covered" },
			{ figure: "Cashflow", note: "measurably improved" },
			{ figure: `${yearsIn("nas")} yrs`, note: "and still accountable" },
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
		body: "That gap is the whole engineering problem, and it's where I've spent this year. A self-hosted MCP server on a VPS I administer, encrypted at rest, with a library of Claude Code agents that route inputs, hold state across sessions and take real actions. Explicit tool scopes, guardrails, per-task model selection, definitions under version control, and scheduled headless runs with nobody watching. When one collided with sync and split twelve files, I found it and fixed it.",
		proof: [
			{ figure: "12+", note: "agents in service" },
			{ figure: "Unattended", note: "scheduled runs" },
			{ figure: "3", note: "tools published" },
		],
	},
	{
		key: "pipeline",
		card: {
			eyebrow: "Data",
			title: "Our pipeline is buckling and nobody wants to touch it.",
		},
		eyebrow: "SAVR · closing project, 2026",
		title: "The symptom was throughput. The cause was that nobody had asked what changed since last time.",
		body: "The existing pipeline re-pulled entire source on every run and was buckling. A faster full pull buys you six months; moving to delta changes the shape of the problem. In a regulated market correctness and auditability come before speed, and taking load off the upstream systems mattered as much as our own numbers. I left something the next engineer could reason about, which is the actual point of the exercise.",
		proof: [
			{ figure: "Full to delta", note: "pipeline rebuilt" },
			{ figure: "4", note: "systems left running" },
			{ figure: "14 mo", note: "tenure at SAVR" },
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
		body: "Six months in I was made lead developer, with a team of juniors to bring up. The code review became the training: retrospectives, workshops, and a written standard in the company knowledge base. I sat in with the CTO on hiring and wrote the coding task every candidate worked through, so they all met the same bar. And I built the KPI app the team tracked itself with, checked against the CFO's numbers.",
		proof: [
			{ figure: "6 mo", note: "to lead developer" },
			{ figure: "Coding task", note: "used to screen candidates" },
			{ figure: "KPI app", note: "built with the CFO" },
		],
	},
	{
		key: "presales",
		card: {
			eyebrow: "Pre-sales",
			title: "We need someone who can sell the architecture, not just draw it.",
		},
		eyebrow: "FLIC Sites · six years, 160+ projects",
		title: "Customers arrive with a solution already chosen. The job is finding the problem it was meant to solve.",
		body: "Every project started with me in a room arguing a proposal against agencies with more people and better decks. I quoted work, lost some of it, and learned why, because scoping to win is how you lose money on delivery. And there was no handover to a delivery team: what I promised in the room is what I then had to make exist, which is a very effective discipline on what you promise.",
		proof: [
			{ figure: "160+", note: "sold and delivered" },
			{ figure: "1.1M+", note: "SEK billed since" },
			{ figure: "800k+", note: "from one renewing client" },
		],
	},
];

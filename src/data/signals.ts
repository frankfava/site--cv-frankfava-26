/** What ends a conversation, and what has an answer. */
import type { _Card } from "@/types";

export interface Signal extends _Card {
	ends?: boolean;
	/** Keeps a signal off the page while its wording stays authored here. */
	hidden?: boolean;
}

export async function signals(): Promise<Signal[]> {
	return [
		{
			ends: true,
			title: "The working language has to be English",
			body: "My Swedish is basic. I understand a fair amount; pronunciation has always been the struggle. If your team works in Swedish, I'm not your candidate.",
		},
		{
			ends: true,
			hidden: true,
			title: "No Swedish security clearance",
			body: "Säkerhetsklass 1–2 requires Swedish citizenship. I'm Australian and Italian, so it's legally closed to me.",
		},
		{
			ends: false,
			title: "I'm in Australia for weeks at a time, most years",
			body: "My family is in Sydney and I go back for extended stretches, most often around Christmas.",
			turnLead: "I work remotely while I'm there.",
			turn: "I both enjoy and need that flexibility. The rest of the year I want the office - the environment, the collaborating, being amongst colleagues.",
		},
		{
			ends: false,
			title: "No university degree",
			body: "I don't have one.",
			turnLead: "And it hasn't been the gate.",
			turn: "Eighteen years and nine roles hired on evidence, including a regulated fintech and a part-time CTO seat. The work is the qualification, and it's all on this site.",
		},
		{
			ends: false,
			title: "Most of my career is self-employed, not corporate",
			body: "I've run my own business for more of my career than I've been an employee.",
			turnLead: "Which is exactly why I'm useful.",
			turn: "Nobody else was doing the selling, delivery, support, hiring or cashflow, so I had to do all of them. Most people at my level have only done one side of that table.",
		},
		{
			ends: false,
			title: "I started out as a coach, not an engineer",
			body: "Five years as a professional coach before I wrote software for a living.",
			turnLead: "It's the discovery skill, not a detour.",
			turn: "Coaching is getting someone with a messy situation to a decision they'll act on. It's why an architecture review and a nervous CFO are the same conversation to me.",
		},
		{
			ends: false,
			title: "My CTO title is part-time, at a small company",
			body: "Sixty hours a month, not a full-time seat at scale.",
			turnLead: "Four years, sole technical voice, still the call when it breaks.",
			turn: "Accountability and duration are the proof here, not headcount.",
		},
	].map((signal) => ({ ...signal, eyebrow: signal.ends ? "Ends it" : "Answered" }));
}

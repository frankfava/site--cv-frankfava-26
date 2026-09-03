/** The deeper pages, as cards. */
import { getCollection } from "astro:content";
import { createWorkHistoryManager } from "@/lib/collections/workHistory";
import type { _Card } from "@/types";

export interface Destination extends _Card {}

export async function destinations(): Promise<Destination[]> {
	// This count sits on the card linking to the list, so it has to match what
	// the list actually shows.
	const [projects, certifications, work] = await Promise.all([getCollection("projects", ({ data }) => !data.draft && data.listed), getCollection("certifications"), createWorkHistoryManager()]);

	const careerStart = work.earliestStart();

	return [
		{
			eyebrow: `${projects.length} projects`,
			title: "Work",
			body: "Every project with the technologies, the constraints and what it produced.",
			link: {
				href: "/work",
			},
		},
		{
			eyebrow: "Built and operated",
			title: "AI practice",
			body: "The agentic tooling I run daily, the three published tools, and what I actually use them for.",
			link: {
				href: "/ai",
			},
		},
		{
			eyebrow: `${work._get().length} roles${careerStart ? ` · ${careerStart.getFullYear()} →` : ""}`,
			title: "Experience",
			body: "The full timeline, every role, and the achievements attached to each of them.",
			link: {
				href: "/experience",
			},
		},
		{
			eyebrow: "Including the tests",
			title: "How I work",
			body: "Strengths, failure modes, and my MBTI, DISC and Enneagram results explained plainly.",
			link: {
				href: "/how-i-work",
			},
		},
		{
			eyebrow: `${certifications.length} certifications`,
			title: "Credentials",
			body: "What I have, what I don't, and every credential linked back to the issuer.",
			link: {
				href: "/credentials",
			},
		},
		{
			eyebrow: "Rights and availability",
			title: "Practicalities",
			body: "Availability, rights, language and the questions that always come up first.",
			link: {
				href: "/practicalities",
			},
		},
		{
			eyebrow: "Printable",
			title: "One-pager",
			body: "The scannable version, for a fast skim or an ATS upload.",
			link: {
				href: "/one-pager",
			},
		},
	];
}

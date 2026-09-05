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
			titleIcon: "ph:lego-duotone",
			body: "Every project with the technologies, the constraints and what it produced.",
			link: {
				href: "/work",
			},
		},
		{
			eyebrow: "Built and operated",
			title: "AI practice",
			titleIcon: "ph:sparkle-duotone",
			body: "The agentic tooling I run daily, published tools I've authored, and what I actually use them for.",
			link: {
				href: "/ai",
			},
		},
		{
			eyebrow: `${work._get().length} roles${careerStart ? ` · ${careerStart.getFullYear()} → Present` : ""}`,
			title: "Experience",
			titleIcon: "ph:calendar-star-duotone",
			body: "The full timeline, every role, and the achievements attached to each of them.",
			link: {
				href: "/experience",
			},
		},
		{
			eyebrow: "Temperament",
			title: "About me",
			titleIcon: "ph:fingerprint-simple-duotone",
			body: "Who I am, how I behave under pressure, what I'm still learning, and what the personality tests make of me.",
			link: {
				href: "/about",
			},
		},
		{
			eyebrow: `${certifications.length} certifications`,
			title: "Credentials",
			titleIcon: "ph:ladder-duotone",
			body: "What I have, what I don't, and every credential linked back to the issuer.",
			link: {
				href: "/credentials",
			},
		},
		{
			eyebrow: "Printable",
			title: "One-pager",
			titleIcon: "ph:file-duotone",
			body: "The scannable printable version, for a fast skim.",
			link: {
				href: "/one-pager",
			},
		},
	];
}

/**
 * Two kinds of work, kept apart on purpose: systems I still get called about,
 * and work done inside someone else's architecture. Most CVs flatten the two.
 */
import { getCollection } from "astro:content";

export type Ownership = "mine" | "handed-over";

export interface System {
	ownership: Ownership;
	live: boolean;
	status: string;
	title: string;
	body: string;
	figure: string;
	figureNote: string;
	rank: number;
}

/** The rows with no project of their own: one role, and an era of them. */
const FROM_ROLES: System[] = [
	{
		ownership: "handed-over",
		live: false,
		status: "Handed over · 2026",
		title: "SAVR crypto trading integration",
		body: "Led the integration that enabled cryptocurrency trading on a regulated Stockholm investment platform, as primary backend engineer.",
		figure: "Led",
		figureNote: "regulated market",
		rank: 1,
	},
	{
		ownership: "handed-over",
		live: false,
		status: "2014 – 2020",
		title: "160+ agency builds",
		body: "E-commerce, membership platforms and learning systems, sold and built by me on a reusable foundation I extended per customer.",
		figure: "160+",
		figureNote: "projects",
		rank: 4,
	},
];

const COLUMNS = [
	{
		ownership: "mine" as const,
		countLabel: "still live",
		title: "Systems I built and stayed accountable for",
		why: "I designed these, shipped them, and I'm still the one who gets called.",
	},
	{
		ownership: "handed-over" as const,
		countLabel: "handed over",
		title: "Work I did inside someone else's system",
		why: "Good work, real constraints, but the architecture wasn't mine to set.",
	},
];

export interface SystemGroup {
	countLabel: string;
	title: string;
	why: string;
	systems: System[];
}

export async function systemGroups(): Promise<SystemGroup[]> {
	const fromProjects = (await getCollection("projects", ({ data }) => !data.draft))
		.map(({ data }) => (data.stillRunning ? { ...data.stillRunning, title: data.stillRunning.title ?? data.title } : null))
		.filter((system) => system !== null);

	const all = [...fromProjects, ...FROM_ROLES];

	return COLUMNS.map((column) => ({
		...column,
		systems: all.filter((system) => system.ownership === column.ownership).sort((a, b) => a.rank - b.rank),
	}));
}

/**
 * The systems I designed and still get called about. Projects marked
 * `handed-over` keep that flag and are deliberately absent here.
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

export async function stillRunningSystems(): Promise<System[]> {
	return (await getCollection("projects", ({ data }) => !data.draft))
		.map(({ data }) => (data.stillRunning ? { ...data.stillRunning, title: data.stillRunning.title ?? data.title } : null))
		.filter((system) => system !== null)
		.filter((system) => system.ownership === "mine")
		.sort((a, b) => a.rank - b.rank);
}

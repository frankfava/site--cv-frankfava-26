/** The hologram's nodes: every role and every published project, newest first. */
import { getCollection } from "astro:content";

/** Theme tokens against the `--c-*` ramp, so the canvas follows the mode. */
const COLOURS = {
	role: "accent-300",
	customer: "cyan-300",
	personal: "amber-300",
};

export const HOLOGRAM_FRAME = {
	wireframe: "cyan-300",
	link: "accent-300",
};

const LABELLED = 6;

export interface HologramNode {
	label: string;
	colour: string;
	prominent: boolean;
}

export async function hologramNodes(): Promise<HologramNode[]> {
	const roles = (await getCollection("workHistory")).map((entry) => ({
		label: entry.data.company,
		colour: COLOURS.role,
		at: entry.data.startDate,
	}));

	const projects = (await getCollection("projects", ({ data }) => !data.draft)).map((entry) => ({
		label: entry.data.title,
		colour: entry.data.type === "Personal Project" ? COLOURS.personal : COLOURS.customer,
		at: entry.data.startDate,
	}));

	return [...roles, ...projects].sort((a, b) => b.at.getTime() - a.at.getTime()).map(({ label, colour }, index) => ({ label, colour, prominent: index < LABELLED }));
}

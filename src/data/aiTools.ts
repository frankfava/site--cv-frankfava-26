/**
 * The AI tools worth showing on the AI page, in the order they are argued for.
 *
 * Named rather than derived: the page is making a point about tools I built and
 * published, which is not a property the project collection records.
 */
import { getCollection } from "astro:content";
import type { _Card } from "@/types";

const FEATURED = ["ai-skill-create-mvp", "lovable-prompt-builder"];

export async function tools(): Promise<_Card[]> {
	const projects = await getCollection("projects");

	return FEATURED.map((id) => projects.find((project) => project.id === id))
		.filter((project) => !!project)
		.map(({ id, data }) => ({
			title: data.title,
			body: data.summary,
			// The demo is the point when there is one; the repo is the fallback
			// proof, and the project page carries both either way.
			link: { href: data.demoUrl ?? data.repoUrl ?? `/projects/${id}` },
		}));
}

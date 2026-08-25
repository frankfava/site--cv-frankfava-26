import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

/** Skills */
const skills = defineCollection({
	loader: file("src/data/skills.json"),
	schema: z.object({
		featured: z.boolean().optional().default(false),
		label: z.string(),
		icon: z.string().optional(),
		proficiency: z.enum(["beginner", "proficient", "senior", "expert"]),
		yrsExperience: z.number().min(0).optional(),
		keywords: z.array(z.string()).optional(),
		usedForCv: z.boolean().optional().default(false),
		note: z.string().optional(),
		// Independent facets:
		//  - active_stack - current focus, hire-me-for-this
		//  - shipped - used in real production work
		//  - peripheral - stack-tooling
		// Sort priority: active_stack > shipped > peripheral; peripheral demotes within tier.
		relevance: z
			.array(z.enum(["active_stack", "shipped", "peripheral"]))
			.optional()
			.default([]),
	}),
});

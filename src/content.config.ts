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

/** Certificates */
const certifications = defineCollection({
	loader: file("src/data/certifications.json"),
	schema: z.object({
		certificate: z.string(),
		issuer: z.string(),
		issueDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		ranking: z.string().optional(),
		expiryDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val))
			.optional(),
		credentialId: z.string().optional(),
		credentialLink: z.url().optional(),
		icon: z.string().optional(),
	}),
});

/** Work History */
const workHistory = defineCollection({
	loader: file("src/data/workHistory.json"),
	schema: z.object({
		company: z.string(),
		role: z.string(),
		startDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		endDate: z
			.string()
			.or(z.date())
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		summary: z.string().optional(),
		location: z.string().optional(),
		locationType: z.enum(["On-Site", "Hybrid", "Office-First", "Remote"]).optional(),
		responsibilities: z.array(z.string()).optional(),
		achievements: z.array(z.string()).optional(),
		featuredAchievements: z.array(z.number().int().min(1)).optional(),
		skills: z.array(z.string()).optional(),
		transferableSkills: z.array(z.string()).optional(),
		isFreelancing: z.boolean().optional(),
		employmentType: z.string().optional(),
		highlight: z
			.object({
				show: z.boolean(),
				label: z.string(),
			})
			.optional(),
	}),
});

export const collections = {
	skills,
	certifications,
	workHistory,
};

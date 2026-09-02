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

/** Projects */
const projects = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/data/projects" }),
	schema: z.object({
		draft: z.boolean().optional().default(false),
		featured: z.boolean().optional().default(false),
		// Keeps a project out of the general list without hiding it. Anything
		// naming a project by id still resolves it, including its own page.
		listed: z.boolean().optional().default(true),
		tags: z
			.array(z.enum(["ai-tool"]))
			.optional()
			.default([]),
		order: z.number().optional(),
		title: z.string(),
		icon: z.string().optional(),
		role: z.string().optional(),
		// `role` is the job title held; this is which job it was held in.
		employer: reference("workHistory").optional(),
		type: z.enum(["Customer Project", "Personal Project"]).default("Customer Project"),
		summary: z.string().optional(),
		startDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		// Either a number of months (e.g. 4) or an ISO 8601 duration string
		// for finer-grained units (e.g. "P2W", "P10D", "P1M2W"). Use null to
		// indicate the project is still ongoing.
		duration: z
			.union([z.number().min(0), z.string().regex(/^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?$/, "Must be an ISO 8601 duration like P2W, P10D, or PT8H")])
			.nullable()
			.optional(),
		highlights: z.array(z.string()).optional(),
		demoUrl: z.string().optional(),
		repoUrl: z.string().optional(),
		skills: z.array(reference("skills")).optional(),
		// A project earns a "case study" treatment by carrying this block.
		// Same underlying entity as the project - just the richer
		// problem → solution → build → outcome framing for role pages,
		// resume.json, etc. Curation per role lives on
		// `RoleDefinition.featuredCaseStudies` (refs project IDs).
		caseStudy: z
			.object({
				audience: z.enum(["customer", "employer", "open-source", "personal"]).optional(),
				problem: z.string(),
				solution: z.string(),
				build: z.string(),
				outcome: z.string(),
			})
			.optional(),
		// A project earns a row in the "still running" section by carrying this
		// block. `ownership` is the split the section exists to make: work whose
		// architecture was mine against work done inside someone else's.
		stillRunning: z
			.object({
				ownership: z.enum(["mine", "handed-over"]),
				live: z.boolean(),
				status: z.string(),
				figure: z.string(),
				figureNote: z.string(),
				// The section argues a different point than the project page, so it
				// gets its own copy rather than reusing `summary`.
				body: z.string(),
				// Strongest first within a column, which is neither date nor `order`.
				rank: z.number(),
				// Only where the canonical title misreads in a card - too long, or
				// the row covers more than the one project.
				title: z.string().optional(),
			})
			.optional(),
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

/**
 * Testimonials
 *
 * Facebook reviews from the FLIC Sites freelancing years. Screenshots rather
 * than transcribed text, because the point is that they are someone else's
 * words in someone else's account, not a quote I typed.
 */
const testimonials = defineCollection({
	loader: file("src/data/testimonials.json"),
	schema: z.object({
		order: z.number().int().positive(),
		name: z.string(),
		src: z.string(),
		// Intrinsic pixel size of the screenshot, so the column reserves the
		// right space before the lazy-loaded image arrives.
		width: z.number().int().positive(),
		height: z.number().int().positive(),
	}),
});

/**
 * Career
 *
 * A per-year read of the work rather than a property of any one job, which is
 * why it is keyed by year: the run is longer than the employment, some years
 * have no employer, and some have two.
 */
const career = defineCollection({
	loader: file("src/data/career.json"),
	schema: z.object({
		decisions: z.number().min(0).max(100),
		customer: z.number().min(0).max(100),
		code: z.number().min(0).max(100),
		leadership: z.number().min(0).max(100),
		role: z.string(),
		company: z.string(),
		note: z.string(),
		employer: reference("workHistory").optional(),
	}),
});

/**
 * Transferable Skills
 *
 * `summary` is optional because the language list lives in site config, and a
 * copy of it here would be a second source for the same list. Entries without
 * one have it resolved in `lib/collections/transferableSkills.ts`.
 */
const transferableSkills = defineCollection({
	loader: file("src/data/transferableSkills.json"),
	schema: z.object({
		order: z.number().int().positive(),
		title: z.string(),
		summary: z.string().optional(),
		icon: z.string().optional(),
		keywords: z.array(z.string()).optional(),
	}),
});

export const collections = {
	skills,
	projects,
	certifications,
	workHistory,
	testimonials,
	career,
	transferableSkills,
};

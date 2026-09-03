import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { METADATA, ABOUT, SITE, SOCIALS } from "site:config";
import { getTestimonials } from "@/lib/collections/testimonials";
import { getTransferableSkills } from "@/lib/collections/transferableSkills";

export const prerender = true;

const dateToIso = (value?: string | Date) => {
	if (!value) return undefined;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

// The export is read off this site, so every URL in it has to be absolute.
const absoluteUrl = (url?: string) => (url === undefined ? undefined : /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : String(SITE.getCanonical(url)));

const stripHtml = (value = "") =>
	value
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export const GET: APIRoute = async () => {
	const [workHistory, skills, certifications, projects, testimonials, transferableSkills] = await Promise.all([
		getCollection("workHistory"),
		getCollection("skills"),
		getCollection("certifications"),
		getCollection("projects"),
		getTestimonials(),
		getTransferableSkills(),
	]);

	// A project references skills by id; the export carries what a reader can use.
	const skillLabelById = new Map(skills.map((skill) => [skill.id, skill.data.label]));
	const sortedWorkHistory = [...workHistory].sort((a, b) => {
		const aDate = a.data.startDate instanceof Date ? a.data.startDate.getTime() : new Date(a.data.startDate).getTime();
		const bDate = b.data.startDate instanceof Date ? b.data.startDate.getTime() : new Date(b.data.startDate).getTime();
		return bDate - aDate;
	});

	const resume = {
		$schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
		basics: {
			name: ABOUT.name,
			label: ABOUT.focuses.join(", "),
			summary: METADATA?.description ?? "",
			email: SOCIALS.email?.href?.replace("mailto:", ""),
			phone: SOCIALS.phone?.href?.replace("tel:", ""),
			url: String(SITE.getCanonical("/")),
			image: String(SITE.getCanonical(ABOUT.requireImage("bw", "the JSON Resume export"))),
			location: {
				address: ABOUT.location?.city,
				city: ABOUT.location?.city,
				region: ABOUT.location?.region,
				countryCode: ABOUT.location?.countryCode,
			},
			profiles: [
				{ network: "GitHub", url: SOCIALS.github?.href, username: SOCIALS.github?.text?.replace(/^github\.com\//, "") },
				{ network: "LinkedIn", url: SOCIALS.linkedin?.href, username: SOCIALS.linkedin?.text?.replace(/^linkedin\.com\/in\//, "") },
			].filter((p) => p.url),
		},
		work: sortedWorkHistory.map((entry) => ({
			name: entry.data.company,
			position: entry.data.role,
			startDate: dateToIso(entry.data.startDate),
			endDate: dateToIso(entry.data.endDate),
			location: entry.data.location,
			summary: entry.data.summary,
			highlights: [...(entry.data.responsibilities ?? []), ...(entry.data.achievements ?? [])].map((item) => stripHtml(item)),
		})),
		skills: [
			...skills.map((skill) => ({
				name: skill.data.label,
				level: skill.data.proficiency,
				keywords: skill.data.keywords ?? [],
			})),
			// The non-technical half of the same claim. No `level`: these carry no
			// proficiency, and the schema has no field for their summary.
			...transferableSkills
				.filter((skill) => skill.data.listed)
				.map((skill) => ({
					name: skill.data.subject ?? skill.data.title,
					keywords: skill.data.keywords ?? [],
				})),
		],
		certificates: certifications.map((cert) => ({
			name: cert.data.certificate,
			issuer: cert.data.issuer,
			date: dateToIso(cert.data.issueDate),
			url: cert.data.credentialLink,
		})),
		languages: (ABOUT.linguistics.languages ?? []).map((lang) => ({
			language: lang.language,
			fluency: lang.fluency,
		})),
		projects: projects
			.filter((project) => !project.data.draft)
			.map((project) => ({
				name: project.data.title,
				description: project.data.summary,
				highlights: project.data.highlights ?? [],
				startDate: dateToIso(project.data.startDate),
				url: absoluteUrl(project.data.demoUrl ?? project.data.repoUrl),
				keywords: (project.data.skills ?? []).map((skill) => skillLabelById.get(skill.id) ?? skill.id),
				type: project.data.type,
				roles: project.data.role ? [project.data.role] : [],
			})),
		// Each reference is a screenshot of a review in the reviewer's own account.
		// `url` points at that, because the schema's `reference` field is read as
		// the reviewer's own words and nothing here can honestly fill it.
		references: testimonials.map((testimonial) => ({
			name: testimonial.data.name,
			url: absoluteUrl(testimonial.data.src),
		})),
		meta: {
			canonical: absoluteUrl("/resume.json"),
			version: "v1",
		},
	};

	return new Response(JSON.stringify(resume, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

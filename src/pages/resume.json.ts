import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { METADATA, ABOUT, SITE, SOCIALS } from "site:config";

export const prerender = true;

const dateToIso = (value?: string | Date) => {
	if (!value) return undefined;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const stripHtml = (value = "") =>
	value
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export const GET: APIRoute = async () => {
	const [workHistory, skills, certifications, projects] = await Promise.all([getCollection("workHistory"), getCollection("skills"), getCollection("certifications"), getCollection("projects")]);
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
			image: ABOUT.getImage("profile_main"),
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
		skills: skills.map((skill) => ({
			name: skill.data.label,
			level: skill.data.proficiency,
			keywords: skill.data.keywords ?? [],
		})),
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
				url: project.data.demoUrl ?? project.data.repoUrl,
				keywords: (project.data.skills ?? []).map((skill) => String(skill)),
				entity: project.data.type,
				roles: project.data.role ? [project.data.role] : [],
			})),
		meta: {
			canonical: "/resume.json",
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

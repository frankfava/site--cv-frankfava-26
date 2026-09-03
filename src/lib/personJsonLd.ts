import { getCollection } from "astro:content";
import { ABOUT, METADATA, SOCIALS } from "site:config";
import { getCanonical } from "@/utils/permalinks";
import { getTransferableSkills } from "@/lib/collections/transferableSkills";

const stripHtml = (value = "") =>
	value
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export async function buildPersonJsonLd() {
	const [skills, workHistory, certifications, transferableSkills] = await Promise.all([
		getCollection("skills"),
		getCollection("workHistory"),
		getCollection("certifications"),
		getTransferableSkills(),
	]);

	// Pull headline skills via the curated `relevance` tag rather than the
	// legacy `usedForCv` / `featured` flags. active_stack is the curated
	// "what I want hired for" list - the right surface for schema.org
	// `knowsAbout`.
	const topSkills = skills
		.filter((item) => item.data.relevance?.includes("active_stack"))
		.sort((a, b) => (b.data.yrsExperience ?? 0) - (a.data.yrsExperience ?? 0))
		.map((item) => item.data.label);

	// The non-technical half. Without it the entity knows only the engineering
	// side of a role that is half engineering and half leading the people doing it.
	const topTransferableSkills = transferableSkills.filter((item) => item.data.listed).map((item) => item.data.subject ?? item.data.title);

	const sortedHistory = workHistory.slice().sort((a, b) => +new Date(b.data.startDate) - +new Date(a.data.startDate));

	// Every employer, current and past. A Role stands in for the value of the
	// property it hangs off and repeats that property inside itself, which is
	// why each one carries its own `worksFor`.
	const roles = sortedHistory.map((entry) => ({
		"@type": "Role",
		roleName: entry.data.role,
		startDate: new Date(entry.data.startDate).toISOString(),
		...(entry.data.endDate ? { endDate: new Date(entry.data.endDate).toISOString() } : {}),
		worksFor: {
			"@type": "Organization",
			name: entry.data.company,
		},
		description: stripHtml(entry.data.summary ?? entry.data.achievements?.[0] ?? ""),
	}));

	const credentials = certifications.slice(0, 10).map((cert) => ({
		"@type": "EducationalOccupationalCredential",
		name: cert.data.certificate,
		credentialCategory: cert.data.ranking ?? "Certification",
		recognizedBy: {
			"@type": "Organization",
			name: cert.data.issuer,
		},
		...(cert.data.credentialLink ? { url: cert.data.credentialLink } : {}),
		...(cert.data.issueDate ? { dateCreated: new Date(cert.data.issueDate).toISOString() } : {}),
	}));

	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: ABOUT.name,
		jobTitle: ABOUT.focuses.join(", "),
		image: getCanonical(ABOUT.requireImage("avatar", "the Person JSON-LD")),
		hasOccupation: ABOUT.focuses.map((title) => ({
			"@type": "Occupation",
			name: title,
		})),
		description: METADATA.description,
		url: String(getCanonical("/")),
		email: SOCIALS.email?.href?.replace("mailto:", ""),
		telephone: SOCIALS.phone?.href?.replace("tel:", ""),
		address: {
			"@type": "PostalAddress",
			addressLocality: ABOUT.location?.city,
			addressRegion: ABOUT.location?.region,
			addressCountry: ABOUT.location?.countryCode,
		},
		knowsAbout: [...topSkills, ...topTransferableSkills],
		knowsLanguage: ABOUT.linguistics.languages.map((lang) => ({
			"@type": "Language",
			name: lang.language,
			description: lang.fluency,
		})),
		hasCredential: credentials,
		// The whole chain, newest first. The role without an `endDate` is the
		// current one, so it needs no separate statement.
		worksFor: roles,
		sameAs: [SOCIALS.github?.href, SOCIALS.linkedin?.href].filter(Boolean),
	};
}

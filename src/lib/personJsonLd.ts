import { getCollection } from "astro:content";
import { ABOUT, METADATA, SOCIALS } from "site:config";
import { getCanonical } from "@/utils/permalinks";

const stripHtml = (value = "") =>
	value
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

export async function buildPersonJsonLd() {
	const [skills, workHistory, certifications] = await Promise.all([getCollection("skills"), getCollection("workHistory"), getCollection("certifications")]);

	// Pull headline skills via the curated `relevance` tag rather than the
	// legacy `usedForCv` / `featured` flags. active_stack is the ~10-skill
	// curated list of "what I want hired for" - the right surface for
	// schema.org `knowsAbout`.
	const topSkills = skills
		.filter((item) => item.data.relevance?.includes("active_stack"))
		.sort((a, b) => (b.data.yrsExperience ?? 0) - (a.data.yrsExperience ?? 0))
		.map((item) => item.data.label);

	const sortedHistory = workHistory.slice().sort((a, b) => +new Date(b.data.startDate) - +new Date(a.data.startDate));

	// All past + current employers - schema.org-friendly Role array under hasOfferCatalog.
	// Previously capped at 6; lifted so AI agents / ATS see the full employment chain.
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

	// Top-level `worksFor` = current employer (most recent entry with no endDate).
	// Distinct from hasOfferCatalog (which is the full chain) - schema.org expects
	// a single Organization here, signalling "this person currently works for X".
	const currentEmployerEntry = sortedHistory.find((e) => !e.data.endDate);
	const worksFor = currentEmployerEntry
		? {
				"@type": "Organization",
				name: currentEmployerEntry.data.company,
			}
		: undefined;

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
		image: getCanonical(ABOUT.getImage("avatar")),
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
		knowsAbout: topSkills,
		knowsLanguage: ABOUT.linguistics.languages.map((lang) => ({
			"@type": "Language",
			name: lang.language,
			description: lang.fluency,
		})),
		hasCredential: credentials,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Professional Experience",
			itemListElement: roles,
		},
		...(worksFor ? { worksFor } : {}),
		sameAs: [SOCIALS.github?.href, SOCIALS.linkedin?.href].filter(Boolean),
	};
}

import { getCollection, getEntries, type CollectionEntry } from "astro:content";
import type { CareerYearId } from "content:ids";
import type { CareerYear } from "@/data/career";

export namespace Career {
	export type Entry = { id: CareerYearId } & Omit<CollectionEntry<"career">, "id">;
	export type Collection = Entry[];
}

type Employer = CollectionEntry<"workHistory">["data"];

/** Employed roles are placed; the self-employed and sub-contracted ones are not. */
const isEmployed = (employer: Employer): boolean => !!employer.employmentType?.startsWith("Full-Time") || !!employer.employmentType?.startsWith("Part-Time");

/** How an employer reads in a year's headline: legal suffix dropped, city added where it places him. */
function companyLabel(employer: Employer): string {
	if (!isEmployed(employer)) return employer.company;
	const city = employer.location?.split(",")[0].trim();
	const name = employer.company.replace(/\s+AB$/, "");
	return city ? `${name} · ${city}` : name;
}

/** The career years, oldest first. Sorted numerically because the id is a year, not a rank. */
export async function getCareerYears(): Promise<CareerYear[]> {
	const years: Career.Collection = await getCollection("career");
	const resolved = await Promise.all(
		years.map(async ({ id, data }) => {
			const employers = (await getEntries(data.employers)).map((entry) => entry.data);
			return {
				year: Number(id),
				...data,
				role: data.role ?? employers.map((employer) => employer.role).join(" + "),
				company: data.company ?? employers.map(companyLabel).join(" / "),
			};
		}),
	);
	return resolved.sort((a, b) => a.year - b.year);
}

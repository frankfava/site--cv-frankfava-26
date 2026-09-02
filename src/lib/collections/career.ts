import { getCollection, type CollectionEntry } from "astro:content";
import type { CareerYearId } from "content:ids";
import type { CareerYear } from "@/data/career";

export namespace Career {
	export type Entry = { id: CareerYearId } & Omit<CollectionEntry<"career">, "id">;
	export type Collection = Entry[];
}

/** The career years, oldest first. Sorted numerically because the id is a year, not a rank. */
export async function getCareerYears(): Promise<CareerYear[]> {
	const years: Career.Collection = await getCollection("career");
	return years.map(({ id, data }) => ({ year: Number(id), ...data })).sort((a, b) => a.year - b.year);
}

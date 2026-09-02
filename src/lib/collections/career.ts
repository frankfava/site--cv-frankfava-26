import { getCollection } from "astro:content";
import type { CareerYear } from "@/data/career";

/** The career years, oldest first. Sorted numerically because the id is a year, not a rank. */
export async function getCareerYears(): Promise<CareerYear[]> {
	return (await getCollection("career")).map(({ id, data }) => ({ year: Number(id), ...data })).sort((a, b) => a.year - b.year);
}

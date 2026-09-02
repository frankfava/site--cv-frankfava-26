import { CAREER_SERIES, type CareerYear } from "@/data/career";

export function yearAverage(year: CareerYear): number {
	return Math.round(CAREER_SERIES.reduce((sum, series) => sum + year[series.key], 0) / CAREER_SERIES.length);
}

/** The year the read-out opens on, named rather than positioned so inserting a year cannot move it. */
export const CAREER_DEFAULT_YEAR = 2022;

export const openingIndex = (years: CareerYear[]): number =>
	Math.max(
		0,
		years.findIndex((year) => year.year === CAREER_DEFAULT_YEAR),
	);

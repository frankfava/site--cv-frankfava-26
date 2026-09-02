import type { CareerMetric } from "@/data/careerSeries";
import type { CareerYear } from "@/lib/collections/career";

/** The series to average over, so this file does not reach into authored data. */
type Series = readonly { key: CareerMetric }[];

export function yearAverage(series: Series, year: CareerYear): number {
	return Math.round(series.reduce((sum, { key }) => sum + year.axes[key], 0) / series.length);
}

/** The year the read-out opens on, named rather than positioned so inserting a year cannot move it. */
export const CAREER_DEFAULT_YEAR = 2022;

export const openingIndex = (years: CareerYear[]): number =>
	Math.max(
		0,
		years.findIndex((year) => year.year === CAREER_DEFAULT_YEAR),
	);

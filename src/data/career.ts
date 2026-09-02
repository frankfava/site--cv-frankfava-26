/**
 * The four things a year of work is measured on here, and the arithmetic over
 * them. Client-safe on purpose: the Alpine store imports this, so it must not
 * reach for the content collection.
 */
export interface CareerYear {
	year: number;
	/** How much of the deciding was mine. */
	decisions: number;
	/** How close the customer sat. */
	customer: number;
	/** How much of the week went on code. */
	code: number;
	/** Accountable for someone else's growth or output. */
	leadership: number;
	role: string;
	company: string;
	note: string;
}

export interface CareerSeries {
	key: "decisions" | "customer" | "code" | "leadership";
	label: string;
	/** Shared by the chart line, the legend and the read-out bar. */
	color: string;
}

export const CAREER_SERIES: CareerSeries[] = [
	{ key: "decisions", label: "Decision rights", color: "var(--c-accent)" },
	{ key: "customer", label: "Customer-facing", color: "var(--c-cyan)" },
	{ key: "code", label: "Hands-on coding", color: "var(--c-ink-3)" },
	{ key: "leadership", label: "Leadership responsibility", color: "var(--c-warn)" },
];

/** The four series averaged: one number for how much of a year's work suited me. */
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

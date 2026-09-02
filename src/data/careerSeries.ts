/**
 * The four things a year of work is measured on. Client-safe: the Alpine store
 * imports this, so it must stay free of anything that reaches the collection.
 */
export const CAREER_SERIES = [
	{ key: "decisions", label: "Decision rights", color: "var(--c-accent)" },
	{ key: "customer", label: "Customer-facing", color: "var(--c-cyan)" },
	{ key: "code", label: "Hands-on coding", color: "var(--c-ink-3)" },
	{ key: "leadership", label: "Leadership responsibility", color: "var(--c-warn)" },
] as const;

/** Checked against the schema's `axes` wherever a year is indexed by it. */
export type CareerMetric = (typeof CAREER_SERIES)[number]["key"];

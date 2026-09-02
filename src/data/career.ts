/**
 * The four things a year of work is measured on. Client-safe: the Alpine store
 * imports this, so the only thing it may take from `astro:content` is a type.
 */
import type { CollectionEntry } from "astro:content";

export const CAREER_SERIES = [
	{ key: "decisions", label: "Decision rights", color: "var(--c-accent)" },
	{ key: "customer", label: "Customer-facing", color: "var(--c-cyan)" },
	{ key: "code", label: "Hands-on coding", color: "var(--c-ink-3)" },
	{ key: "leadership", label: "Leadership responsibility", color: "var(--c-warn)" },
] as const satisfies readonly { key: keyof CareerYear["axes"]; label: string; color: string }[];

export type CareerMetric = (typeof CAREER_SERIES)[number]["key"];

/**
 * A collection entry flattened onto the year its id names, with `role` and
 * `company` resolved - either the year's override or derived from `employers`.
 */
export type CareerYear = { year: number; role: string; company: string } & CollectionEntry<"career">["data"];

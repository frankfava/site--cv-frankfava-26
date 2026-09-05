/** The capabilities the check compares. */
import { codingStart, hobbyCodingStart, yearsIn } from "@/lib/spans";
import { inWords } from "@/utils/number";
export interface Capability {
	id: string;
	label: string;
	/** Radar axes have no room for the full label. */
	short: string;
	/** Where the evidence puts me. */
	sits: number;
	/** Where the slider starts. */
	defaultNeed: number;
	/** Kept as selectable text: employers screen on these phrases. */
	evidence: string;
}

export const CAPABILITIES = [
	{
		id: "cust",
		label: "Customer-facing and pre-sales",
		short: "Customer",
		sits: 95,
		defaultNeed: 85,
		evidence: "160+ projects sold and built. Account executive and engineer on every one.",
	},
	{
		id: "arch",
		label: "Owning the architecture",
		short: "Architecture",
		sits: 90,
		defaultNeed: 85,
		evidence: `${inWords(yearsIn("nas"), "Sentence")} years as the only technical voice at an asset-management company. One domain model, multiple services.`,
	},
	{
		id: "scale",
		label: "Architecture at enterprise scale",
		short: "Enterprise",
		sits: 38,
		defaultNeed: 85,
		evidence: "My depth is owning systems end to end for small and mid-sized businesses.",
	},
	{
		id: "ai",
		label: "Agentic AI in production",
		short: "Agentic AI",
		sits: 85,
		defaultNeed: 85,
		evidence: 'A self-hosted "second brain" built using Claude, running scheduled agents, and supporting ongoing personal and work-related tasks.',
	},
	{
		id: "code",
		label: "Hands-on engineering",
		short: "Hands-on",
		sits: 88,
		defaultNeed: 85,
		evidence: `${new Date().getFullYear() - hobbyCodingStart().getFullYear()} years of coding experience. Paid to write code since ${codingStart().getFullYear()}. `,
	},
	{
		id: "lead",
		label: "Leading and coaching engineers",
		short: "Leading",
		sits: 78,
		defaultNeed: 85,
		evidence: "Lead developer within six months, training juniors. I wrote the task we screened candidates with.",
	},
] as const satisfies readonly Capability[];

export type CapabilityId = (typeof CAPABILITIES)[number]["id"];

/**
 * The ones named, in the order named. Naming none gives the whole set in its
 * declared order, which is the order the radar takes its geometry from, so a
 * caller states a priority without disturbing the array behind the shape.
 */
export function capabilitiesNamed(ids: readonly CapabilityId[] = []): readonly Capability[] {
	if (!ids.length) return CAPABILITIES;
	return ids.map((id) => CAPABILITIES.find((capability) => capability.id === id)).filter((capability) => !!capability);
}

/** The capabilities the check compares. */
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

export const CAPABILITIES: Capability[] = [
	{
		id: "cust",
		label: "Customer-facing and pre-sales",
		short: "Customer",
		sits: 95,
		defaultNeed: 70,
		evidence: "160+ projects sold and built. Account executive and engineer on every one.",
	},
	{
		id: "arch",
		label: "Owning the architecture",
		short: "Architecture",
		sits: 90,
		defaultNeed: 70,
		evidence: "Four years as the only technical voice at NAS. One domain model, three surfaces.",
	},
	{
		id: "ai",
		label: "Agentic AI in production",
		short: "Agentic AI",
		sits: 85,
		defaultNeed: 60,
		evidence: "Self-hosted MCP server, 12+ agents, unattended scheduled runs. I'm the on-call.",
	},
	{
		id: "code",
		label: "Hands-on engineering",
		short: "Hands-on",
		sits: 88,
		defaultNeed: 60,
		evidence: "Eighteen years. Most recently a crypto trading integration in a regulated fintech.",
	},
	{
		id: "lead",
		label: "Leading and coaching engineers",
		short: "Leading",
		sits: 78,
		defaultNeed: 50,
		evidence: "Five years a professional coach, ICI certified. Led at iGoMoon, managed contractors at NAS.",
	},
	{
		id: "scale",
		label: "Architecture at enterprise scale",
		short: "Enterprise",
		sits: 38,
		defaultNeed: 30,
		evidence: "My depth is owning systems end to end for small and mid-sized businesses.",
	},
];

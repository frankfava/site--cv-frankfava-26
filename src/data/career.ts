/** Eighteen years as four things that vary independently, rather than a list of titles. */
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

export const CAREER_YEARS: CareerYear[] = [
	{
		year: 2008,
		decisions: 15,
		customer: 30,
		code: 60,
		leadership: 5,
		role: "Network Administrator",
		company: "Patrician Brothers, Blacktown · Sydney",
		note: "Twelve-month traineeship keeping a school's network alive. First paid technical job.",
	},
	{
		year: 2009,
		decisions: 20,
		customer: 35,
		code: 65,
		leadership: 5,
		role: "Building on the side",
		company: "Sydney",
		note: "Sites and small applications for whoever would pay, while working out whether this was a career.",
	},
	{
		year: 2010,
		decisions: 45,
		customer: 95,
		code: 20,
		leadership: 60,
		role: "Personal Relationship Coach",
		company: "Relationships Revealed",
		note: "Five years coaching people through change, professionally, with my own book of clients.",
	},
	{
		year: 2011,
		decisions: 45,
		customer: 95,
		code: 25,
		leadership: 60,
		role: "Personal Relationship Coach",
		company: "Relationships Revealed",
		note: "Nobody hands you authority in coaching. The client either comes back or they don't.",
	},
	{
		year: 2012,
		decisions: 48,
		customer: 95,
		code: 35,
		leadership: 60,
		role: "Coaching, building more",
		company: "Relationships Revealed",
		note: "The software work started taking over. Same instinct: understand what the person actually needs first.",
	},
	{
		year: 2013,
		decisions: 55,
		customer: 90,
		code: 55,
		leadership: 55,
		role: "Coaching, building more",
		company: "Sydney",
		note: "Two careers at once, and the technical one was winning.",
	},
	{
		year: 2014,
		decisions: 78,
		customer: 92,
		code: 80,
		leadership: 25,
		role: "Founder",
		company: "FLIC Sites",
		note: "Started the agency. From day one I was the person who sold the work and the person who then had to build it.",
	},
	{
		year: 2015,
		decisions: 80,
		customer: 92,
		code: 85,
		leadership: 30,
		role: "Founder",
		company: "FLIC Sites",
		note: "E-commerce, membership platforms and learning systems for small businesses who couldn't afford to get it wrong.",
	},
	{
		year: 2016,
		decisions: 70,
		customer: 80,
		code: 88,
		leadership: 55,
		role: "Founder + Lead Full-stack Developer",
		company: "FLIC Sites / Focused Results",
		note: "Took a lead developer role alongside the agency. First time leading other engineers.",
	},
	{
		year: 2017,
		decisions: 75,
		customer: 85,
		code: 88,
		leadership: 55,
		role: "Founder + Lead Full-stack Developer",
		company: "FLIC Sites / Focused Results",
		note: "Built a reusable foundation I extended per customer, and a plugin suite across the whole book of work.",
	},
	{
		year: 2018,
		decisions: 82,
		customer: 92,
		code: 85,
		leadership: 32,
		role: "Founder",
		company: "FLIC Sites",
		note: "Peak agency. Defending proposals against agencies with more people and better decks, and winning enough of them.",
	},
	{
		year: 2019,
		decisions: 82,
		customer: 92,
		code: 82,
		leadership: 32,
		role: "Founder",
		company: "FLIC Sites",
		note: "160+ projects delivered across the life of the agency. When it broke, the call came to me.",
	},
	{
		year: 2020,
		decisions: 52,
		customer: 60,
		code: 90,
		leadership: 70,
		role: "Lead Full-stack and HubSpot Developer",
		company: "iGoMoon · Stockholm",
		note: "Moved to Sweden. Code reviews, training juniors, hiring input, and the coding task used to screen candidates.",
	},
	{
		year: 2021,
		decisions: 55,
		customer: 62,
		code: 90,
		leadership: 70,
		role: "Lead Full-stack and HubSpot Developer",
		company: "iGoMoon · Stockholm",
		note: "Co-created HubSpot FieldsJS. HubSpot's core team referenced it in their own documentation.",
	},
	{
		year: 2022,
		decisions: 88,
		customer: 95,
		code: 80,
		leadership: 55,
		role: "Independent, then part-time CTO",
		company: "Cool Company AB / National Auto Service",
		note: "Went independent and picked up NAS. The technology call became entirely mine: architecture, security, roadmap.",
	},
	{
		year: 2023,
		decisions: 90,
		customer: 95,
		code: 75,
		leadership: 65,
		role: "Part-time CTO",
		company: "National Auto Service",
		note: "Reshaped the dispatch workflow and measurably improved their cashflow. Brought in and managed contract developers.",
	},
	{
		year: 2024,
		decisions: 90,
		customer: 95,
		code: 72,
		leadership: 60,
		role: "Part-time CTO",
		company: "National Auto Service",
		note: "Platform reaching most of Australia. Over 1.1M SEK billed freelance by this point.",
	},
	{
		year: 2025,
		decisions: 45,
		customer: 35,
		code: 92,
		leadership: 35,
		role: "Senior Software Engineer",
		company: "SAVR · Stockholm",
		note: "Regulated fintech. Led the crypto trading integration, three admin panels, and a delta ingestion rebuild.",
	},
	{
		year: 2026,
		decisions: 22,
		customer: 20,
		code: 88,
		leadership: 25,
		role: "Web Developer",
		company: "Academedia · Stockholm",
		note: "In-house support team for the Academedia brand's websites, alongside the NAS engagement and the agentic work.",
	},
];

/** The four series averaged: one number for how much of a year's work suited me. */
export function yearAverage(year: CareerYear): number {
	return Math.round(CAREER_SERIES.reduce((sum, series) => sum + year[series.key], 0) / CAREER_SERIES.length);
}

/** The year the read-out opens on. */
export const CAREER_DEFAULT_INDEX = CAREER_YEARS.findIndex((y) => y.year === 2022);

import { type BlueprintSchema, type BlueprintComponent } from "@/lib/blueprints";

export const capability: BlueprintComponent = {
	id: "capability",
	title: "Set what your role needs, and I'll show you where I sit",
	mainMenuLabel: "Capability check",
	eyebrow: "Capability",
	icon: "ph:sliders-horizontal-duotone",
	description: "Every role calls this job something different, so rather than make you pick a title, set what you actually need. The dial on the left keeps your reading as you scroll.",
	content: async () => import("@/components/blueprints/shared/Capability.astro"),
};

export const trackRecord: BlueprintComponent = {
	id: "track-record",
	title: "Eighteen years, described by the shape of the work rather than the titles",
	mainMenuLabel: "Track record",
	eyebrow: "Track record",
	icon: "ph:chart-line-up-duotone",
	description: "Nine roles across two continents, with one thread running through them: I am usually both the person the customer talks to and the person who builds it.",
	content: async () => import("@/components/blueprints/shared/TrackRecord.astro"),
};

export const stillRunning: BlueprintComponent = {
	id: "still-running",
	hidden: true,
	eyebrow: "What's outlived me",
	title: "The systems still running without me",
	mainMenuLabel: "What's still running",
	icon: "ph:hard-drives-duotone",
	description: "There's a real difference between work I contributed to and systems I designed, shipped and stayed accountable for.",
	content: async () => import("@/components/blueprints/shared/StillRunning.astro"),
};

export const yourProblem: BlueprintComponent = {
	id: "your-problem",
	eyebrow: "Your problem",
	title: "Tell me which of these sounds like your week",
	mainMenuLabel: "Your problem",
	icon: "ph:crosshair-duotone",
	description: "Four problems I have actually been handed. Pick the closest and I will show you how it went.",
	content: async () => import("@/components/blueprints/shared/Scenarios.astro"),
};

export const beforeWeTalk: BlueprintComponent = {
	id: "before-we-talk",
	eyebrow: "Before we talk",
	title: "Two things end it. Everything else has an answer.",
	mainMenuLabel: "Before we talk",
	icon: "ph:warning-diamond-duotone",
	description: "I would rather a real export constraint ended this now than in week three.",
	content: async () => import("@/components/blueprints/shared/Signals.astro"),
};

export const roleDossiers: BlueprintComponent = {
	id: "role-dossiers",
	eyebrow: "Forward this",
	title: "Four versions of the same evidence, one per role",
	description: "Same evidence, reordered for the role it is aimed at, each with a one-page version you can forward.",
	mainMenuLabel: "Which version to send",
	icon: "ph:paper-plane-tilt-duotone",
	content: async () => import("@/components/blueprints/shared/RoleDossiers.astro"),
};

export const history: BlueprintComponent = {
	id: "history",
	eyebrow: "Every role",
	title: "Nine roles, two continents, one thread",
	mainMenuLabel: "The timeline",
	icon: "ph:clock-countdown-fill",
	description: "In full, most recent first. The short version of the same thing is the chart on the front page.",
	content: async () => import("@/components/blueprints/shared/History.astro"),
};

export const achievements: BlueprintComponent = {
	id: "achievements",
	eyebrow: "What came of it",
	title: "What came of each of them",
	mainMenuLabel: "Achievements",
	icon: "ph:trophy-duotone",
	description: "Grouped by the company they belong to, so a claim always has a place attached to it.",
	content: async () => import("@/components/blueprints/shared/Achievements.astro"),
};

export const practice: BlueprintComponent = {
	id: "practice",
	eyebrow: "How I work with it",
	title: "I build with it daily, and I run what I build",
	mainMenuLabel: "AI practice",
	icon: "ph:sparkle-duotone",
	description: "Where AI sits in the work, the tools I have published, and what I think it does and does not change about the job.",
	content: async () => import("@/components/blueprints/shared/AiPractice.astro"),
};

export const education: BlueprintComponent = {
	id: "education",
	eyebrow: "Formal education",
	title: "No degree, and eighteen years of the work instead",
	mainMenuLabel: "Education",
	icon: "ph:graduation-cap-duotone",
	description: "Nobody who has hired me has needed one, including a regulated fintech and a part-time CTO seat. If it is a hard requirement, that is a real filter and it is better found now.",
	content: async () => import("@/components/blueprints/shared/Education.astro"),
};

export const certifications: BlueprintComponent = {
	id: "certifications",
	eyebrow: "Issued and verifiable",
	title: "What I do hold, every one linked back to its issuer",
	mainMenuLabel: "Certifications",
	icon: "ph:ladder-duotone",
	description: "Issued by someone other than me, and checkable.",
	content: async () => import("@/components/blueprints/shared/Certifications.astro"),
};

//Hiring
export const situation: BlueprintComponent = {
	id: "situation",
	eyebrow: "Availability",
	title: "Where I am, what I am looking for, and when I can start",
	mainMenuLabel: "Current situation",
	icon: "ph:alarm-duotone",
	description: "The questions that come up first in a screen, answered before you have to ask them.",
	content: async () => import("@/components/blueprints/shared/Situation.astro"),
};
// How I Work
export const self: BlueprintComponent = {
	id: "self",
	eyebrow: "Strengths and failure modes",
	title: "How I would describe myself, including the parts that cost me",
	mainMenuLabel: "Strengths and failure modes",
	icon: "ph:brain-duotone",
	description: "Written to be useful to whoever manages me, which means the weaknesses are in here too.",
	content: async () => import("@/components/blueprints/shared/Self.astro"),
};

//LearningAndProblemSolving
export const learning: BlueprintComponent = {
	id: "learning",
	eyebrow: "Cold starts",
	title: "Picking up a domain I have never seen before",
	mainMenuLabel: "Learning and problem-solving",
	icon: "ph:chalkboard-teacher-duotone",
	description: "The competence that matters most in a cold start, and the one I have had the most practice at.",
	content: async () => import("@/components/blueprints/shared/Learning.astro"),
};

// Personality Tests
export const tests: BlueprintComponent = {
	id: "tests",
	eyebrow: "An outside read",
	title: "An outside read, explained rather than just scored",
	mainMenuLabel: "Personality tests",
	icon: "ph:test-tube-duotone",
	description: "MBTI, DISC and Enneagram, with what each one means for anyone who has not met them before.",
	content: async () => import("@/components/blueprints/shared/PersonalityTests.astro"),
};

export const references: BlueprintComponent = {
	id: "references",
	eyebrow: "What others say",
	title: "What people who worked with me say",
	mainMenuLabel: "References",
	icon: "ph:chat-centered-dots-duotone",
	description: "There is only so much weight my own account can carry.",
	content: async () => import("@/components/blueprints/shared/References.astro"),
};

export const projects: BlueprintComponent = {
	id: "projects",
	eyebrow: "Portfolio",
	title: "Every project, with the constraint it actually had",
	mainMenuLabel: "Projects",
	icon: "ph:desktop",
	description: "Filter by the technology you care about. Each entry carries the context, what it had to work around, and what it produced.",
	content: async () => import("@/components/blueprints/shared/Projects.astro"),
};

export const skills: BlueprintComponent = {
	id: "skills",
	eyebrow: "What I build with",
	title: "The technologies behind them",
	mainMenuLabel: "Technical skills",
	icon: "ph:brackets-curly",
	description: "Searchable and filterable by proficiency, because a list this long is only useful if you can cut it down to what your role needs.",
	content: async () => import("@/components/blueprints/shared/TechnicalSkills.astro"),
};

export const fullRecord: BlueprintComponent = {
	id: "full-record",
	title: "The full record, one page at a time",
	mainMenuLabel: "The full record",
	eyebrow: "Go deeper",
	icon: "ph:books-duotone",
	description: "Nothing has been cut, it's just no longer in your way.",
	content: async () => import("@/components/blueprints/shared/FullRecord.astro"),
};

export default {
	capability,
	trackRecord,
	stillRunning,
	yourProblem,
	beforeWeTalk,
	roleDossiers,
	history,
	achievements,
	practice,
	situation,
	self,
	learning,
	tests,
	references,
	projects,
	skills,
	fullRecord,
} as const satisfies BlueprintSchema;

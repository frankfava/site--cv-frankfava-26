import { type BlueprintComponentSchema, type BlueprintComponent } from "@/lib/blueprints";
import { careerYears, roleCount } from "@/lib/spans";
import { inWords } from "@/utils/number";

export const capability: BlueprintComponent = {
	id: "capability",
	title: "Set what your role needs, and I'll show you where I sit",
	mainMenuLabel: "Capability check",
	eyebrow: "Capability",
	icon: "ph:sliders-horizontal-duotone",
	description: "Every role calls for something different, so rather than make you pick a title, set what you actually need.",
	content: async () => import("@/components/blueprints/shared/Capability.astro"),
};

export const trackRecord: BlueprintComponent = {
	id: "track-record",
	title: "I owned the decisions, built the thing, and led the people doing the rest",
	mainMenuLabel: "Track record",
	eyebrow: "Track record",
	icon: "ph:chart-line-up-duotone",
	description: `${inWords(roleCount(), "Sentence")} roles across two continents, and ${inWords(careerYears())} years described by the shape of the work rather than the titles.`,
	content: async () => import("@/components/blueprints/shared/TrackRecord.astro"),
};

export const stillRunning: BlueprintComponent = {
	id: "still-running",
	eyebrow: "What's outlived me",
	title: "The systems still running without me",
	mainMenuLabel: "What's still running",
	icon: "ph:hard-drives-duotone",
	description: "I designed these, shipped them, and I'm still the one who gets called.",
	content: async () => import("@/components/blueprints/shared/StillRunning.astro"),
};

export const yourProblem: BlueprintComponent = {
	id: "your-problem",
	eyebrow: "What landed on my desk",
	title: "Pick the one closest to your week",
	mainMenuLabel: "Problems I've been handed",
	icon: "ph:crosshair-duotone",
	description: "Each is a real engagement, with the decision I made and what came of it.",
	content: async () => import("@/components/blueprints/shared/Scenarios.astro"),
};

export const beforeWeTalk: BlueprintComponent = {
	id: "before-we-talk",
	eyebrow: "Before we talk",
	title: "What could end this, and what only looks like it could",
	mainMenuLabel: "Before we talk",
	icon: "ph:warning-diamond-duotone",
	description: "The constraints, up front rather than in week three.",
	content: async () => import("@/components/blueprints/shared/Signals.astro"),
};

export const roleDossiers: BlueprintComponent = {
	id: "role-dossiers",
	eyebrow: "Forward this",
	title: "Hiring for a specific role?",
	description: "Each page show evidence for the role, and each has a one-page version you can forward.",
	mainMenuLabel: "Role pages",
	icon: "ph:paper-plane-tilt-duotone",
	content: async () => import("@/components/blueprints/shared/RoleDossiers.astro"),
};

export const history: BlueprintComponent = {
	id: "history",
	eyebrow: "Every role",
	title: `${inWords(roleCount(), "Sentence")} roles, two continents, one thread`,
	mainMenuLabel: "The timeline",
	icon: "ph:clock-countdown-fill",
	description: "In full, most recent first. The short version of the same thing is the chart on the front page.",
	content: async () => import("@/components/blueprints/shared/History.astro"),
};

export const achievements: BlueprintComponent = {
	id: "achievements",
	eyebrow: "What came of it",
	title: "Notable Achievements",
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
	description: "The system I run every day, the tools I have published, and how the job changes.",
	content: async () => import("@/components/blueprints/shared/AiPractice.astro"),
};

export const education: BlueprintComponent = {
	id: "education",
	eyebrow: `No degree, and ${careerYears()} years of the work instead`,
	title: "Formal education",
	mainMenuLabel: "Education",
	icon: "ph:graduation-cap-duotone",
	description: "Nobody who has hired me has needed a formal degree, but a degree and an education are not the same thing.",
	content: async () => import("@/components/blueprints/shared/Education.astro"),
};

export const certifications: BlueprintComponent = {
	id: "certifications",
	eyebrow: "Issued and verifiable",
	title: "Certifications",
	icon: "ph:ladder-duotone",
	description: "Every one issued by somebody else, with a link back to them.",
	content: async () => import("@/components/blueprints/shared/Certifications.astro"),
};

export const languages: BlueprintComponent = {
	id: "languages",
	eyebrow: "Working language",
	title: "English works, Swedish is basic",
	mainMenuLabel: "Language",
	icon: "ph:translate-duotone",
	description: "Worth stating plainly, because for some teams it is the whole answer.",
	content: async () => import("@/components/blueprints/shared/Languages.astro"),
};

// About me
export const quickIntro: BlueprintComponent = {
	id: "quick-intro",
	eyebrow: "Quick Intro",
	title: "Sydney to Stockholm",
	mainMenuLabel: "Quick intro",
	icon: "ph:hand-waving-duotone",
	description: "Where I'm from, where I landed, and the jobs that had nothing to do with any of it.",
	content: async () => import("@/components/blueprints/shared/QuickIntro.astro"),
};

export const self: BlueprintComponent = {
	id: "self",
	eyebrow: "Strengths and failure modes",
	title: "How I would describe myself, including the parts that cost me",
	mainMenuLabel: "Strengths and failure modes",
	icon: "ph:brain-duotone",
	description: "The bullets are unflattering in places, which is the point.",
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
export const personalityTests: BlueprintComponent = {
	eyebrow: "An outside read",
	title: "Personality tests",
	icon: "ph:test-tube-duotone",
	description: "Psychometric tests on how I work, and what to do with it.",
	content: async () => import("@/components/blueprints/shared/PersonalityTests.astro"),
};

export const references: BlueprintComponent = {
	id: "references",
	eyebrow: "What others say",
	title: "What people who worked with me say",
	mainMenuLabel: "References",
	icon: "ph:chat-centered-dots-duotone",
	description: "These are Facebook reviews from customers of my agency, FLIC Sites. Their words, not mine.",
	content: async () => import("@/components/blueprints/shared/References.astro"),
};

export const transferableSkills: BlueprintComponent = {
	id: "transferable-skills",
	eyebrow: "Self-employed",
	title: "Working for myself meant doing every part of the job",
	mainMenuLabel: "Transferable skills",
	icon: "ph:lightbulb-filament-duotone",
	description: "Selling it, delivering it and coaching through it all happened alongside the code, not before it.",
	content: async () => import("@/components/blueprints/shared/TransferableSkills.astro"),
};

export const projects: BlueprintComponent = {
	id: "projects",
	eyebrow: "Portfolio",
	title: "Every project, and what it had to work around",
	mainMenuLabel: "Projects",
	icon: "ph:desktop",
	description: "Filter by the technology you care about. Each entry carries the context and what it produced.",
	content: async () => import("@/components/blueprints/shared/Projects.astro"),
};

export const skills: BlueprintComponent = {
	id: "skills",
	eyebrow: "What I build with",
	title: "The technologies behind the work",
	mainMenuLabel: "Technical skills",
	icon: "ph:brackets-curly",
	description: "Search it, or filter by proficiency.",
	content: async () => import("@/components/blueprints/shared/TechnicalSkills.astro"),
};

export const fullRecord: BlueprintComponent = {
	id: "full-record",
	showInSearch: false,
	title: "The full record, one page at a time",
	mainMenuLabel: "More information",
	showInSidebar: false,
	eyebrow: "Go deeper",
	icon: "ph:books-duotone",
	description: "Dive deeper into my work, my skills, my experience, and my certifications.",
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
	education,
	certifications,
	languages,
	self,
	learning,
	personalityTests,
	references,
	transferableSkills,
	projects,
	skills,
	fullRecord,
} as const satisfies BlueprintComponentSchema;

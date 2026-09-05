import { type BlueprintComponentSchema } from "@/lib/blueprints";

export const buildRoleStructure = (roleTitle: string) =>
	({
		brief: {
			props: { showHeader: false },
			title: roleTitle ?? "Why this role",
			mainMenuLabel: "The Pitch",
			icon: "ph:blueprint-duotone",
			content: async () => import("@/components/roles/_shared/Pitch.astro"),
		},
		mappings: {
			title: "What I bring → What this role needs",
			mainMenuLabel: "The Mapping",
			icon: "ph:link-duotone",
			description: "Each line connects something I have done to something this role asks for.",
			content: async () => import("@/components/roles/_shared/Mappings.astro"),
		},
		caseStudies: {
			title: "Engagements, start to finish",
			mainMenuLabel: "Case Studies",
			icon: "ph:medal-duotone",
			description: "The problem, what I did about it, and what came of it.",
			content: async () => import("@/components/roles/_shared/CaseStudies.astro"),
		},
		transferableSkills: {
			title: "What carries over from everything else",
			mainMenuLabel: "Transferable",
			icon: "ph:lightbulb-filament-duotone",
			description: "The half of the job that is not code, and where I learnt it.",
			content: async () => import("@/components/roles/_shared/TransferableSkills.astro"),
		},
		featuredProjects: {
			title: "The work closest to this role",
			mainMenuLabel: "Projects",
			icon: "ph:rocket-launch-duotone",
			description: "The work that did the same job this one does.",
			content: async () => import("@/components/roles/_shared/FeaturedProjects.astro"),
		},
		certifications: {
			title: "Certifications",
			mainMenuLabel: "Certifications",
			icon: "ph:certificate-duotone",
			description: "The ones that bear on this role, each linked back to its issuer.",
			content: async () => import("@/components/roles/_shared/Certifications.astro"),
		},
		featuredSkills: {
			title: "The technologies this role names",
			mainMenuLabel: "Skills",
			icon: "ph:wrench-duotone",
			description: "Cut down from the full list to what the job ads for this role ask for.",
			content: async () => import("@/components/roles/_shared/FeaturedSkills.astro"),
		},
	}) as const satisfies BlueprintComponentSchema;

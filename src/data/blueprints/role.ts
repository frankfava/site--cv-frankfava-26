import { type BlueprintSchema } from "@/lib/blueprints";

export const buildRoleStructure = (roleTitle: string) =>
	({
		brief: {
			props: { showHeader: false },
			title: roleTitle ?? "Why this role",
			mainMenuLabel: "The Pitch",
			icon: "ph:blueprint-duotone",
			content: async () => import("@/components/roles/_shared/Pitch.astro"),
		},
		featuredSkills: {
			title: "Featured Skills",
			mainMenuLabel: "Skills",
			icon: "ph:wrench-duotone",
			description: "The technical skills most relevant to this role.",
			content: async () => import("@/components/roles/_shared/FeaturedSkills.astro"),
		},
		featuredProjects: {
			title: "Featured Projects",
			mainMenuLabel: "Projects",
			icon: "ph:rocket-launch-duotone",
			description: "Projects most relevant to this role.",
			content: async () => import("@/components/roles/_shared/FeaturedProjects.astro"),
		},
		certifications: {
			title: "Certifications",
			mainMenuLabel: "Certifications",
			icon: "ph:certificate-duotone",
			description: "Certifications relevant to this role.",
			content: async () => import("@/components/roles/_shared/Certifications.astro"),
		},
		transferableSkills: {
			title: "Transferable Skills",
			mainMenuLabel: "Transferable",
			icon: "ph:lightbulb-filament-duotone",
			description: "Non-technical skills that translate directly to this role.",
			content: async () => import("@/components/roles/_shared/TransferableSkills.astro"),
		},
		mappings: {
			title: "What I bring → What this role needs",
			mainMenuLabel: "The Mapping",
			icon: "ph:link-duotone",
			description: "Specific examples - each line connects something I've done to something this role calls for.",
			content: async () => import("@/components/roles/_shared/Mappings.astro"),
		},
		caseStudies: {
			title: "Case Studies",
			mainMenuLabel: "Case Studies",
			icon: "ph:medal-duotone",
			description: "End-to-end engagements: problem → solution → build → outcome.",
			content: async () => import("@/components/roles/_shared/CaseStudies.astro"),
		},
	}) as const satisfies BlueprintSchema;

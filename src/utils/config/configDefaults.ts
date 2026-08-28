/**
 * Config Defaults
 * NOTE: Use non alias paths so it can be used in theme css generation
 */
import { defu } from "defu";
import type { Config } from "../../types/config";

/** Apply Defaults and create complete config structure from partial */
export function applyConfigDefaults(config: Config.Initial | Record<string, unknown>): Config.Complete {
	const _defaults = {
		site: {
			name: "Website",
			site: globalThis.SITE_URL,
			base: "/",
			trailingSlash: null,
			logos: {
				favicon: undefined,
				faviconSvg: undefined,
			},
		},
		metadata: {
			title: {
				default: undefined,
				template: "%s",
			},
			author: null,
			description: "",
			robots: {
				index: false,
				follow: true,
			},
			openGraph: {
				site_name: "",
				images: [],
				type: "website",
			},
			manifestPublic: undefined,
		},
		i18n: {
			language: "en",
			textDirection: "ltr",
		},
		analytics: {
			vendor: undefined,
		},
		ui: {
			theme: "system",
			layout: "narrow",
			colors: {
				primary: "#434E5E",
				secondary: "#479FC8",
				accent: "#05505C",
			},
			fonts: {
				family: {
					primary: "Poppins:wght@400;600;700",
					primary_type: "sans-serif",
					secondary: "",
					secondary_type: "sans-serif",
				},
				font_size: {
					basePx: 16,
					scale: 0.25,
				},
			},
		},
		about: {
			name: "",
			focuses: [],
			availability: {
				status: "available",
				text: "Available",
				noticeRequired: "Minimal",
			},
			dob: "",
			location: undefined,
			workRights: undefined,
			nationality: undefined,
			linguistics: {
				summary: undefined,
				languages: [],
			},
			profileImages: [],
		},
		display: {
			tagline: "",
			showAvailability: true,
			showAvatar: true,
			footer: {
				lead: {
					title: "",
					description: "",
				},
			},
		},
		socials: {},
	};

	const merged = defu(config ?? {}, _defaults) as Config.Complete;

	// Default Title
	merged.metadata.title = {
		...merged.metadata.title,
		default: merged.metadata?.title?.default || merged.site.name,
	};

	return merged;
}

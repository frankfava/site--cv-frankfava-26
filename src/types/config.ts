import type { HTMLAttributes } from "astro/types";
import type { SocialsManager } from "../lib/socials";

export namespace Config {
	/** Initial Config */
	export type Initial = {
		site: App.SiteConfig;
		metadata?: App.MetaData.Base;
		i18n?: App.I18NConfig;
		analytics?: App.Analytics.Config;
		ui?: App.UIConfig;
		about?: About.Base;
		display?: Display.Base;
		socials?: Socials.Links;
	};

	/** Merged Config before Utitlies are added  */
	export type Complete = {
		site: App.SiteConfig;
		metadata: App.MetaData.Base;
		i18n: App.I18NConfig;
		analytics: App.Analytics.Config;
		ui: App.UIConfig;
		about: About.Base;
		display: Display.Base;
		socials: Socials.Links;
	};

	/** Merged Config after Utitlies are added */
	export type Final = {
		site: App.SiteConfig & {
			getCanonical: (path?: string) => string | URL;
		};
		metadata: App.MetaData.Base;
		i18n: App.I18NConfig;
		analytics: App.Analytics.Resolved;
		theme: Omit<App.UIConfig, "fonts" | "theme"> & {
			default: App.UIConfig["theme"];
			lightModeAllowed: boolean;
			darkModeAllowed: boolean;
		};
		colors: { light: App.ModeConfig["colors"]; dark: App.ModeConfig["colors"] };
		fonts: App.UIConfig["fonts"];
		about: Omit<About.Base, "nationality" | "linguistics" | "jobTitles"> & {
			firstName: string;
			lastName: string;
			age: number;
			jobTitles: string[];
			locationFull: string;
			getImage: (name: string) => string | undefined;
			nationality: About.Nationality[];
			linguistics: Omit<About.Linguistics, "languages"> & {
				languages: About.Language[];
			};
		};
		display: Display.Base;
		features: {};
		socials: SocialsManager & Record<Socials.LinkKey, Socials.Link> & ReturnType<SocialsManager["get"]>;
	};
}

export namespace App {
	export type SiteConfig = {
		name: string;
		site?: string;
		base?: string;
		trailingSlash?: boolean | null;
		logos?: {
			favicon?: string;
			faviconSvg?: string;
		};
	};

	export namespace MetaData {
		export interface Base {
			title?: {
				default: string;
				template?: string;
			};
			robots?: Robots;
			description?: string;
			openGraph?: OpenGraph;
			twitter?: Twitter;
			author?: string;
			manifestPublic?: string;
		}

		export interface Robots {
			index?: boolean;
			follow?: boolean;
		}

		export interface Image {
			url: string;
			width?: number;
			height?: number;
		}

		export interface OpenGraph {
			url?: string;
			siteName?: string;
			images?: Array<Image>;
			locale?: string;
			type?: string;
		}

		export interface Twitter {
			handle?: string;
			site?: string;
			cardType?: string;
		}
	}

	export type I18NConfig = {
		language: string;
		textDirection: string;
		dateFormatter?: Intl.DateTimeFormat;
	};

	export namespace Analytics {
		export type Config = {
			vendor?: "fathom" | "googleAnalytics" | "metrical" | "plausible" | "simpleAnalytics" | "umami" | "amplitude" | "matomo" | "minimalAnalytics" | "none";
		};

		export type Resolved = Config & {
			googleSiteVerificationId?: string;
			fathom?: {
				siteId?: string;
				scriptUrl?: string;
			};
			/** Shared by the `googleAnalytics` and `minimalAnalytics` vendors. */
			googleAnalytics?: {
				id?: string;
			};
			metrical?: {
				appId?: string;
			};
			plausible?: {
				domain?: string;
				scriptUrl?: string;
			};
			umami?: {
				id?: string;
				scriptUrl?: string;
			};
			amplitude?: {
				apiKey?: string;
			};
			matomo?: {
				id?: string;
				origin?: string;
			};
		};
	}

	/** One colour mode's authored values. */
	export type ModeConfig = {
		colors?: Record<string, string>;
		shadow?: string;
	};

	export type UIConfig = {
		theme: "system" | "light" | "dark" | "light:only" | "dark:only";
		layout: "narrow" | "wide";
		/** Colour is a function of mode, so mode is the outer axis. Every colour
		 *  lives under both blocks and is ramped in both; light lands on `:root`
		 *  and dark on `.dark`, so one class retints the site. Both modes should
		 *  declare the same keys. */
		light?: ModeConfig;
		dark?: ModeConfig;
		fonts?: {
			family: {
				primary?: string;
				primary_type?: "sans-serif" | "serif" | "monospace";
				secondary?: string;
				secondary_type?: "sans-serif" | "serif" | "monospace";
			};
			font_size: {
				basePx?: number;
				scale?: number;
			};
		};
	};
}

export namespace About {
	export type Base = {
		name: string;
		jobTitles: string | string[];
		availability?: Availability;
		dob?: Date | string;
		location?: Location | undefined;
		workRights?: string;
		nationality?: Nationality | Nationality[];
		linguistics?: Linguistics;
		profileImages: Images;
	};

	export type Availability = {
		status: "available" | "unavailable" | "notice_required";
		text: string;
		noticeRequired: "Minimal" | "Standard" | "Extended" | "None" | string;
	};

	export type Location = {
		city: string;
		countryCode: string;
		region: string;
	};

	export type Nationality = {
		label: string;
		flagIcon: string;
	};

	export type Linguistics = {
		summary?: string;
		languages?: Language | Language[];
	};

	export type Language = {
		language: string;
		description: string;
		fluency: "Native" | "Fluent" | "Conversational" | "Elementary" | "Beginner";
	};

	export type Images = {
		name: string;
		url: string | URL;
	}[];
}

export namespace Display {

	export type Base = {
		tagline: string;
		showAvailability: boolean;
		showAvatar: boolean;
		footer: Footer;
	};
	
	export type Footer = {
		lead: {
			title: string;
			description: string;
		};
	};
}

export namespace Socials {
	export type LinkKey = "email" | "phone" | "github" | "linkedin" | "facebook" | "x" | "youtube" | "codepen" | "whatsapp" | "vcard";

	export type Link = Omit<HTMLAttributes<"a">, "slot"> & {
		label?: string;
		icon?: string;
		text: string;
		href: string;
		suffixIcon?: string;
	};

	export type Links = Record<string, Link>;
}

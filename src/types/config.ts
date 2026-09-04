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
		sidebar?: App.SidebarConfig;
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
		sidebar: App.SidebarConfig;
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
		sidebar: App.SidebarConfig;
		colors: { light: App.ModeConfig["colors"]; dark: App.ModeConfig["colors"] };
		fonts: App.UIConfig["fonts"];
		about: Omit<About.Base, "nationality" | "linguistics" | "focuses"> & {
			firstName: string;
			lastName: string;
			age: number;
			focuses: string[];
			locationFull: string;
			getImage: (name: string) => string | undefined;
			requireImage: (name: string, wantedBy: string) => string;
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

	export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

	/** One colour mode's authored values. */
	export type ModeConfig = {
		colors?: Record<string, string>;
		shadow?: string;
	};

	/** Sidebar mechanics. */
	export type SidebarConfig = {
		/** localStorage key holding the visitor's open/closed preference. */
		storageKey: string;
		/** Below this breakpoint the sidebar is off-canvas by default and closes on navigation. */
		autoHideAt: Breakpoint;
		/** The `data-*` attribute every toggle carries. */
		toggleAttr: string;
		/** What a first-time visitor gets, before any preference exists. */
		onLoad: "open" | "closed" | "reveal";
	};

	export type UIConfig = {
		theme: "system" | "light" | "dark" | "light:only" | "dark:only";
		layout: "narrow" | "wide";
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
		focuses: string | string[];
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
		text?: string;
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
		showTagline: boolean;
		showAvailability: boolean;
		showAvatar: boolean;
		footer: Footer;
	};

	export type Footer = {
		lead: {
			title: string;
			description?: string;
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
		displayable?: boolean;
	};

	export type Links = Record<string, Link>;
}

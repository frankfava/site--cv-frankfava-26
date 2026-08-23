import type { HTMLAttributes } from "astro/types";
import type { SocialsManager } from "../lib/socials";

export namespace Config {
	/** Initial Config */
	export type Initial = {
		site: App.SiteConfig;
		metadata?: App.MetaData.Base;
		i18n?: App.I18NConfig;
		ui?: App.UIConfig;
		socials?: Socials.Links;
	};

	/** Merged Config before Utitlies are added  */
	export type Complete = {
		site: App.SiteConfig;
		metadata: App.MetaData.Base;
		i18n: App.I18NConfig;
		ui: App.UIConfig;
		socials: Socials.Links;
	};

	/** Merged Config after Utitlies are added */
	export type Final = {
		site: App.SiteConfig & {
			getCanonical: (path?: string) => string | URL;
		};
		metadata: App.MetaData.Base;
		i18n: App.I18NConfig;
		theme: Omit<App.UIConfig, "colors" | "fonts" | "theme"> & {
			default: App.UIConfig["theme"];
			lightModeAllowed: boolean;
			darkModeAllowed: boolean;
		};
		colors: App.UIConfig["colors"];
		fonts: App.UIConfig["fonts"];
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

	export type I18NConfig = {
		language: string;
		textDirection: string;
		dateFormatter?: Intl.DateTimeFormat;
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

	export type UIConfig = {
		theme: "system" | "light" | "dark" | "light:only" | "dark:only";
		colors?: {
			primary?: string;
			secondary?: string;
			accent?: string;
		};
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

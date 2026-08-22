export namespace Config {
	/** Initial Config */
	export type Initial = {
		site: App.SiteConfig;
		metadata?: App.MetaData.Base;
		i18n?: App.I18NConfig;
	};

	/** Merged Config before Utitlies are added  */
	export type Complete = {
		site: App.SiteConfig;
		metadata: App.MetaData.Base;
		i18n: App.I18NConfig;
	};

	/** Merged Config after Utitlies are added */
	export type Final = {
		site: App.SiteConfig & {
			getCanonical: (path?: string) => string | URL;
		};
		metadata: App.MetaData.Base;
		i18n: App.I18NConfig;
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
}

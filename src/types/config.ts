export namespace Config {
	/** Initial Config */
	export type Initial = {
		site: App.SiteConfig;
		i18n?: App.I18NConfig;
	};

	/** Merged Config before Utitlies are added  */
	export type Complete = {
		site: App.SiteConfig;
		i18n: App.I18NConfig;
	};

	/** Merged Config after Utitlies are added */
	export type Final = {
		site: App.SiteConfig & {
			getCanonical: (path?: string) => string | URL;
		};
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
}

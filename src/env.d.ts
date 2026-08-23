interface ImportMetaEnv {
	/** Site URL */
	readonly SITE_URL: string;
	/** Base URL */
	readonly BASE_URL: string | undefined;
	/** Trialing Slash */
	readonly TRAILING_SLASH: "always" | "never" | "ignore";
	/** Root Directory */
	ROOT_DIR: string;
	/** Public Directory */
	PUBLIC_DIR: string;

	// === Analytic Vendors ===

	/** Google Site Verification ID */
	readonly GOOGLE_SITE_VERIFICATION_ID: string | undefined;
	/** Fathom Site ID */
	readonly FATHOM_SITE_ID: string | undefined;
	/** Fathom Script URL */
	readonly FATHOM_SCRIPT_URL: string | undefined;
	/** Google Analytics ID, used by both the googleAnalytics and minimalAnalytics vendors */
	readonly GOOGLE_ANALYTICS_ID: string | undefined;
	/** Metrical App ID */
	readonly METRICAL_APP_ID: string | undefined;
	/** Plausible Domain */
	readonly PLAUSIBLE_DOMAIN: string | undefined;
	/** Plausible Script URL */
	readonly PLAUSIBLE_SCRIPT_URL: string | undefined;
	/** Umami ID */
	readonly UMAMI_ID: string | undefined;
	/** Umami Script URL */
	readonly UMAMI_SCRIPT_URL: string | undefined;
	/** Amplitude API Key */
	readonly AMPLITUDE_API_KEY: string | undefined;
	/** Matomo ID */
	readonly MATOMO_ID: string | undefined;
	/** Matomo Script URL */
	readonly MATOMO_ORIGIN: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	Alpine: import("alpinejs").Alpine;
}

/** Site URL */
declare var SITE_URL: string;
/** Base URL */
declare var BASE_URL: string;
/** Trialing Slash */
declare var TRAILING_SLASH: "always" | "never" | "ignore";
/** Color Scheme Switcher - Defined in JsApplyColorMode.astro */
declare var colorSchemeSwitcher;

/** Remove the optional modifier and strip undefined from the value types (also strips undefined from T itself) */
type FullyDefined<T> = T extends object ? { [K in keyof T]-?: NonNullable<T[K]> } : NonNullable<T>;

/** Recursively remove null/undefined from the value types (also strips undefined from T itself) */
type DeepFullyDefined<T> = T extends Array<infer U> ? Array<DeepFullyDefined<U>> : T extends object ? { [K in keyof T]-?: DeepFullyDefined<NonNullable<T[K]>> } : NonNullable<T>;

/** Strip undefined from every property */
type NoUndefined<T> = {
	[K in keyof T]: Required<T[K]>;
};

/** Recursively make all properties optional */
type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Make all properties required (inverse of Partial) */
type DeepRequired<T> = {
	[K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	Alpine: import("alpinejs").Alpine;
}


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

/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	Alpine: import("alpinejs").Alpine;
}

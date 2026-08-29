import tsParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import tailwind from "eslint-plugin-tailwindcss";

/**
 * Tailwind class hygiene, on the Astro parser.
 *
 * Ordering is Prettier's job, so `classnames-order` is off. Everything left
 * catches a class that renders differently from how it reads.
 */
export default [
	{ ignores: ["dist/", "build/", ".astro/", "node_modules/", "src/assets/css/_theme.generated.css", "src/lib/_theme.generated.js"] },

	...astro.configs["flat/base"],

	{ files: ["**/*.{ts,tsx,mts,cts}"], languageOptions: { parser: tsParser } },

	{
		...tailwind.configs.recommended,
		files: ["**/*.astro", "**/*.{js,ts,jsx,tsx}"],
		settings: {
			...tailwind.configs.recommended.settings,
			tailwindcss: { cssConfigPath: "./src/assets/css/main.css" },
		},
		rules: {
			...tailwind.configs.recommended.rules,
			"tailwindcss/classnames-order": "off",
			"tailwindcss/enforces-canonical-classname": "warn",
			"tailwindcss/no-unnecessary-arbitrary-value": "warn",
			"tailwindcss/no-contradicting-classname": "error",
			"tailwindcss/no-custom-classname": "off",
		},
	},
];

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import shadesOf, { hexToRgb } from "./shades.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

const siteConfigPath = join(repoRoot, "src/data/site-config.json");

if (!existsSync(siteConfigPath)) {
	console.error(`Site config file not found at ${siteConfigPath}`);
	process.exit(1);
}

const siteConfig = JSON.parse(readFileSync(siteConfigPath, "utf8"));

const ui = siteConfig?.ui ?? {};
const fonts = ui.fonts ?? {};
const fontSize = fonts.font_size ?? { basePx: 16, scale: 0.25 };
const fontFamily = fonts.family ?? {};

/**
 * Colour is a function of mode, so mode is the outer axis: every colour is
 * authored under `ui.light` / `ui.dark` and ramped in both. Light lands on
 * `:root` and dark on `.dark`, so the existing class toggle retints the whole
 * site by swapping one class.
 */
const MODES = ["light", "dark"];
const colorsFor = (mode) => ui[mode]?.colors ?? {};
const names = Object.keys(colorsFor("light"));

/** `warn` has always been the same value as `amber`. Aliased rather than
 *  authored twice, so the two cannot drift. */
const ALIASES = { warn: "amber" };

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const fontBase = Number(fontSize.basePx);
const fontScale = Number(fontSize.scale);
const headingSize = (mult) => Number(1 + fontScale * mult).toPrecision(2);

const rootLines = [];

/* ---------------------------------------------------------------- @theme -- */
/* Only what does not vary by mode. */

const themeLines = [];
themeLines.push(`\t--font-size-base: ${fontBase}px;`);
themeLines.push(`\t--text-h1: ${headingSize(8)}rem;`);
themeLines.push(`\t--text-h2: ${headingSize(5)}rem;`);
themeLines.push(`\t--text-h3: ${headingSize(4)}rem;`);
themeLines.push(`\t--text-h4: ${headingSize(3)}rem;`);
themeLines.push(`\t--text-h5: ${headingSize(2)}rem;`);
themeLines.push(`\t--text-h6: 1rem;`);
themeLines.push("");

/**
 * The font stack, declared once and owned here.
 *
 * `Fonts.astro` emits the `@font-face` rules and the preloads but publishes no
 * variable, so the family is named in exactly one place. The config value is
 * the Google Fonts query - `Public+Sans:wght@300;400` - so the family is
 * everything before the axis list, with the URL encoding undone.
 */
const familyName = (value) => value.split(":")[0].replace(/\+/g, " ");

for (const key of Object.keys(fontFamily).filter((k) => !k.endsWith("_type"))) {
	const type = fontFamily[`${key}_type`] || "sans-serif";
	themeLines.push(`\t--font-${key}: "${familyName(fontFamily[key])}", ${type};`);
}
themeLines.push("");

const breakpoints = { sm: "540px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px", "3xl": "1920px", "4xl": "2560px" };

for (const [name, value] of Object.entries(breakpoints)) {
	rootLines.push(`	--breakpoint-${name}: ${value};`);
	themeLines.push(`	--breakpoint-${name}: ${value};`);
}

/* --------------------------------------------------------- @theme inline -- */
/* Point Tailwind's colour namespace at the properties rather than copying
   their values, so `bg-surface` follows the toggle instead of freezing at
   whichever mode generated it. */

const inlineLines = [];
for (const name of [...names, ...Object.keys(ALIASES)]) {
	inlineLines.push(`\t--color-${name}: var(--c-${name});`);
	inlineLines.push(`\t--color-${name}-rgb: var(--c-${name}-rgb);`);
	if (ALIASES[name]) continue;
	for (const shade of SHADES) inlineLines.push(`\t--color-${name}-${shade}: var(--c-${name}-${shade});`);
}

/* ------------------------------------------------------------- per mode -- */

function modeVars(mode) {
	const colors = colorsFor(mode);
	const lines = [];
	for (const name of names) {
		const value = stripVarFallback(colors[name]);
		const ramp = shadesOf(value);
		for (const [shade, hex] of Object.entries(ramp)) {
			lines.push(`\t--c-${name}${shade === "DEFAULT" ? "" : `-${shade}`}: ${hex};`);
		}
		// Only the base gets an rgb companion: the ramp is for colour, and
		// `rgba(var(--x-rgb), a)` is only ever wanted on the base.
		lines.push(`\t--c-${name}-rgb: ${hexToRgb(value).toArray().join(", ")};`);
	}
	for (const [alias, target] of Object.entries(ALIASES)) {
		lines.push(`\t--c-${alias}: var(--c-${target});`);
		lines.push(`\t--c-${alias}-rgb: var(--c-${target}-rgb);`);
	}
	const shadow = ui[mode]?.shadow;
	if (shadow) lines.push(`\t--c-shadow: ${shadow};`);
	return lines.join("\n");
}

/* ------------------------------------------------------------ js module -- */
/* The same values for anything that needs them before the stylesheet has
   loaded and so cannot read the custom properties from the CSSOM. */

const moduleLines = [];

moduleLines.push(
	`export type Breakpoint = ${Object.keys(breakpoints)
		.map((key) => `"${key}"`)
		.join(" | ")};`,
);
moduleLines.push(`export const BREAKPOINTS : Record<Breakpoint, string> = ${JSON.stringify(breakpoints, null, "\t")};`);

moduleLines.push(
	`export type FontSize = ${Object.keys(fontSize)
		.map((key) => `"${key}"`)
		.join(" | ")};`,
);
moduleLines.push(`export const FONT_SIZE : Record<FontSize, number> = ${JSON.stringify({ basePx: fontBase, scale: fontScale }, null, "\t")};`);

/* ---------------------------------------------------------------- write -- */

const banner = "/* AUTO-GENERATED by integrations/tailwind/generateTheme.mjs - do not edit by hand. */";

const css = `${banner}

@theme {
${themeLines.join("\n")}
}

@theme inline {
${inlineLines.join("\n")}
}

:root {
${rootLines.join("\n")}

${modeVars("light")}
}

.dark {
${modeVars("dark")}
}

/* A sheet printed from dark mode still has to come out light, and the palette
   is one place, so print re-declares the light values on the dark root rather
   than restating a colour at every element that carries a token. */
@media print {
	.dark {
${modeVars("light")}
	}
}
`;

const js = `${banner}

${moduleLines.join("\n\n")}
`;

writeFileSync(resolve(repoRoot, "src/assets/css/_theme.generated.css"), css, "utf8");
writeFileSync(resolve(repoRoot, "src/assets/js/_theme.generated.ts"), js, "utf8");

console.log(`[generateTheme] wrote src/assets/css/_theme.generated.css + src/assets/js/_theme.generated.ts (${names.length} colours x ${MODES.length} modes)`);

function stripVarFallback(value) {
	if (typeof value !== "string") return value;
	const m = /var\([^,]+,\s*([^)]+)\)/.exec(value);
	return m ? m[1].trim() : value;
}

/**
 * Builds one search index.
 *
 * Two layers. Section rows come from walking every page the index covers, so a
 * row already knows its page. Atomic rows come from the collections, via the
 * builders in `src/data/search/builders.ts`, and are placed by resolving the
 * index's anchor against those same pages.
 *
 * Called by `src/pages/api/search-index/[indexSlug].json.ts`.
 */

import type { AstroInstance, MarkdownInstance } from "astro";
import { experimental_AstroContainer } from "astro/container";
import { Icon } from "astro-icon/components";

import type { AssembledBlueprint, AssembledSection, BlueprintEntry } from "@/lib/blueprints";
import type { AtomicBuilder, AtomicKind, IconRenderer, SearchIndexEntry, SearchItem } from "./types";

/** A section paired with the blueprint it was found on. */
interface Placed {
	section: AssembledSection;
	/** The blueprint the section is on. */
	entry: BlueprintEntry;
	/** The enclosing section, or undefined at the top of a blueprint. */
	parent?: AssembledSection;
}

/**
 * What one row's icon may cost, in bytes.
 *
 * Every icon is inlined, so the index carries the whole set. A few brand logos
 * are drawn at a detail no result row shows, the largest being two hundred times
 * the median. Anything over budget falls back to the plain glyph for its kind.
 */
const ICON_BUDGET_BYTES = 4096;

/**
 * Render an icon name to markup, cached by name so a build renders each one once
 * however many rows carry it. Returns "" if the name will not render, or renders
 * past `ICON_BUDGET_BYTES`, for the caller to fall back on.
 */
function makeIconRenderer(container: experimental_AstroContainer): IconRenderer {
	const cache = new Map<string, string>();
	return async (name) => {
		if (!name) return "";
		const cached = cache.get(name);
		if (cached !== undefined) return cached;
		try {
			const html = await container.renderToString(Icon, { props: { name } });
			const affordable = html.length <= ICON_BUDGET_BYTES ? html : "";
			cache.set(name, affordable);
			return affordable;
		} catch {
			cache.set(name, "");
			return "";
		}
	};
}

/** Decode the entities the renderer emits, so the index holds the text a reader sees. */
function decodeEntities(html: string): string {
	return html
		.replace(/&nbsp;/g, " ")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&amp;/g, "&");
}

/**
 * Reduce rendered markup to searchable text.
 *
 * The state machine tracks quotes because a `/<[^>]+>/` pass stops at the first
 * `>` inside an attribute value, which spills Alpine's `x-data` JSON into the
 * index. Styles, scripts, icons and comments are stripped whole, first.
 */
function htmlToText(html: string): string {
	const stripped = html
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<svg[\s\S]*?<\/svg>/gi, " ")
		.replace(/<!--[\s\S]*?-->/g, " ");

	let text = "";
	let inTag = false;
	let quote: string | null = null;

	for (const char of stripped) {
		if (!inTag) {
			char === "<" ? (inTag = true) : (text += char);
			continue;
		}
		if (quote) {
			if (char === quote) quote = null;
		} else if (char === '"' || char === "'") {
			quote = char;
		} else if (char === ">") {
			inTag = false;
			text += " ";
		}
	}

	return decodeEntities(text).replace(/\s+/g, " ").trim();
}

/** Render a leaf section's own copy to text. Returns "" if the section will not render. */
async function sectionBody(container: experimental_AstroContainer, section: AssembledSection): Promise<string> {
	const { content } = section;
	if (typeof content === "string") return htmlToText(content);
	if (typeof content !== "function") return "";

	try {
		const module = (await (content as () => Promise<unknown>)()) as AstroInstance | MarkdownInstance<Record<string, unknown>>;

		if (Object.hasOwn(module as object, "compiledContent")) {
			const compiled = await (module as MarkdownInstance<Record<string, unknown>>).compiledContent();
			return htmlToText(compiled);
		}

		const html = await container.renderToString((module as AstroInstance).default, {
			props: { ...(section as unknown as Record<string, unknown>), id: section.id, header: section.header ?? {} },
		});
		return htmlToText(html);
	} catch {
		return "";
	}
}

/** List a parent section's children by name, so a term appearing only in a child still matches the parent. */
function childrenSummary(section: AssembledSection): string {
	return (section.sections ?? [])
		.filter((child) => !child.hidden)
		.map((child) => [child.header?.title, child.header?.subtitle].filter(Boolean).join(" - "))
		.join(" • ");
}

/**
 * Flatten every section the index covers, carrying the page each was found on.
 *
 * Two ways for a section to stay out, differing in what happens to its children.
 * `hidden` does not render at all, so it is transparent and its children inherit
 * its parent. `showInSearch: false` does render, so it stays the parent its
 * children are found under; only its own row is dropped.
 */
function placeSections(entry: BlueprintEntry, sections: AssembledBlueprint, parent: AssembledSection | undefined, into: Placed[]): Placed[] {
	for (const section of sections) {
		if (!section.hidden && section.showInSearch !== false) into.push({ section, entry, parent });
		placeSections(entry, section.sections ?? [], section.hidden ? parent : section, into);
	}
	return into;
}

/** Flatten every blueprint an index covers into its sections. */
function placeAllSections(blueprints: BlueprintEntry[]): Placed[] {
	return blueprints.flatMap((entry) => placeSections(entry, entry.blueprint.assemble(), undefined, []));
}

/**
 * Resolve where one atomic kind lands.
 *
 * The anchor names a section, not a page, so exactly one page the index covers
 * has to carry it. No match means the section was renamed or dropped; more than
 * one means the anchor no longer says which page it meant. Both would ship links
 * that go to the wrong place, so both stop the build.
 */
function resolveAnchor(indexSlug: string, kind: AtomicKind, anchor: string, placed: Placed[]) {
	const matches = placed.filter(({ section }) => section.id === anchor);

	if (!matches.length) throw new Error(`[search] index "${indexSlug}" lands ${kind} on "#${anchor}", which no blueprint it covers renders`);
	if (matches.length > 1) {
		const covering = matches.map(({ entry }) => entry.slug).join(", ");
		throw new Error(`[search] index "${indexSlug}" lands ${kind} on "#${anchor}", which is rendered by more than one blueprint it covers: ${covering}`);
	}

	const { section, entry } = matches[0];
	return { url: `${entry.path}#${section.id}`, module: section.mainMenuLabel || (section.header?.title ?? ""), page: entry.title };
}

/**
 * What sources the rows: a builder per atomic kind, and the off-site links.
 *
 * Supplied by the caller rather than imported, so this module reads no
 * collection. Both are defined in `src/data/search/builders.ts`.
 */
export interface SearchSources {
	atomics: Record<AtomicKind, AtomicBuilder>;
	socials: (renderIcon: IconRenderer) => Promise<SearchItem[]>;
}

/** Build every row of one index. */
export async function buildSearchIndex(index: SearchIndexEntry, blueprints: BlueprintEntry[], sources: SearchSources): Promise<SearchItem[]> {
	const container = await experimental_AstroContainer.create();
	const renderIcon = makeIconRenderer(container);
	const placed = placeAllSections(blueprints);

	const sectionRows = await Promise.all(
		placed.map(async ({ section, entry, parent }): Promise<SearchItem> => {
			const isGroup = !!section.sections?.length;
			const heading = section.header?.title ?? "";
			return {
				id: `${entry.slug}:${section.id}`,
				url: `${entry.path}#${section.id}`,
				title: section.mainMenuLabel || heading,
				description: section.header?.subtitle ?? "",
				iconHtml: await renderIcon(section.icon),
				module: parent?.mainMenuLabel ?? "",
				page: entry.title,
				body: [heading, section.header?.eyebrow, isGroup ? childrenSummary(section) : await sectionBody(container, section)].filter(Boolean).join(" "),
				kind: "section",
				isGroup,
			};
		}),
	);

	const atomicRows = Object.entries(index.atomics ?? {}).map(([kind, anchor]) => sources.atomics[kind as AtomicKind](renderIcon, resolveAnchor(index.slug, kind as AtomicKind, anchor, placed)));

	if (index.showSocials) atomicRows.push(sources.socials(renderIcon));

	return [...sectionRows, ...(await Promise.all(atomicRows)).flat()];
}

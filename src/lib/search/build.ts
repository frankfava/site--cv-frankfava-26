/**
 * Building one index.
 *
 * Two layers meet here. Sections come from walking every page the index covers,
 * so a row already knows its page. Atomics come from the collections, and are
 * placed by resolving the index's anchor against those same pages - which is
 * what lets an anchor be stated once, without naming a page, and still land
 * somewhere real.
 */

import type { AstroInstance, MarkdownInstance } from "astro";
import { experimental_AstroContainer } from "astro/container";
import { Icon } from "astro-icon/components";

import type { AssembledBlueprint, AssembledSection, BlueprintEntry } from "@/lib/blueprints";
import type { AtomicBuilder, AtomicKind, IconRenderer, SearchIndexEntry, SearchItem } from "./types";

/** A section as the index needs it: what it is called, and where it is. */
interface Placed {
	section: AssembledSection;
	/** The page the section is on. */
	entry: BlueprintEntry;
	/** The enclosing section, or undefined at the top of a page. */
	parent?: AssembledSection;
}

/**
 * What one row's icon may cost.
 *
 * Every icon is inlined, so the index carries the whole set. A handful of brand
 * logos are drawn at a detail no result row shows - the largest is two hundred
 * times the median - and paying for them here buys a glyph five millimetres
 * wide. Anything over budget falls back to the plain glyph for its kind.
 */
const ICON_BUDGET_BYTES = 4096;

/**
 * Render an icon name to markup, caching by name so a build renders each one
 * once however many rows carry it. A name that will not render, or renders past
 * the budget, leaves the slot empty for the caller to fall back on.
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

/** Decode the entities the renderer emits, so the corpus holds the text a reader sees. */
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
 * corpus. Styles, scripts, icons and comments go first, whole.
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

/** A leaf section's own copy, as text. A section that will not render contributes nothing. */
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

/** A parent's children, named, so a term that only appears in one still reaches the parent. */
function childrenSummary(section: AssembledSection): string {
	return (section.sections ?? [])
		.filter((child) => !child.hidden)
		.map((child) => [child.header?.title, child.header?.subtitle].filter(Boolean).join(" - "))
		.join(" • ");
}

/**
 * Every section the index covers, flattened and carrying its page.
 *
 * A hidden section is transparent rather than absent: it does not render, so it
 * is neither indexed nor treated as a parent, but its children still are.
 */
function placeSections(entry: BlueprintEntry, sections: AssembledBlueprint, parent: AssembledSection | undefined, into: Placed[]): Placed[] {
	for (const section of sections) {
		if (!section.hidden) into.push({ section, entry, parent });
		placeSections(entry, section.sections ?? [], section.hidden ? parent : section, into);
	}
	return into;
}

/** Every page an index covers, flattened into its sections. */
function placeAllSections(pages: BlueprintEntry[]): Placed[] {
	return pages.flatMap((entry) => placeSections(entry, entry.blueprint.assemble(), undefined, []));
}

/**
 * Where one atomic kind lands.
 *
 * The anchor names a section, not a page, so exactly one page in the index has
 * to carry it. Nothing means the section was renamed or dropped; more than one
 * means the anchor no longer says which page it meant. Both ship links that go
 * to the wrong place, so both stop the build.
 */
function resolveAnchor(indexSlug: string, kind: AtomicKind, anchor: string, placed: Placed[]) {
	const matches = placed.filter(({ section }) => section.id === anchor);

	if (!matches.length) throw new Error(`[search] index "${indexSlug}" lands ${kind} on "#${anchor}", which no page it covers renders`);
	if (matches.length > 1) {
		const pages = matches.map(({ entry }) => entry.slug).join(", ");
		throw new Error(`[search] index "${indexSlug}" lands ${kind} on "#${anchor}", which is rendered by more than one page it covers: ${pages}`);
	}

	const { section, entry } = matches[0];
	return { url: `${entry.path}#${section.id}`, module: section.mainMenuLabel || (section.header?.title ?? ""), page: entry.title };
}

/** What sources the rows: a builder per atomic kind, and the off-site links. */
export interface SearchSources {
	atomics: Record<AtomicKind, AtomicBuilder>;
	socials: (renderIcon: IconRenderer) => Promise<SearchItem[]>;
}

/** Every row of one index. */
export async function buildSearchIndex(index: SearchIndexEntry, pages: BlueprintEntry[], sources: SearchSources): Promise<SearchItem[]> {
	const container = await experimental_AstroContainer.create();
	const renderIcon = makeIconRenderer(container);
	const placed = placeAllSections(pages);

	const sectionRows = await Promise.all(
		placed.map(async ({ section, entry, parent }): Promise<SearchItem> => {
			const isGroup = !!section.sections?.length;
			const heading = section.header?.title ?? "";
			return {
				id: `${entry.slug}:${section.id}`,
				url: `${entry.path}#${section.id}`,
				// A section's heading is written to be read in place and runs to a
				// sentence. The name the page is navigated by is what fits a row.
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

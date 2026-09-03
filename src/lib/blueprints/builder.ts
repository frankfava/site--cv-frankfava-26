/**
 * Assembling a blueprint: the builder, the section, and the proxies that let a
 * structure be walked by key.
 *
 * Each pair calls the other - a builder creates sections via the section's
 * `createProxy`, and the section calls back - so they stay in one module.
 * Splitting them would turn a type-only relationship into a real circular
 * import. The data shapes live in `./schema`.
 *
 * The part pair is what every medium shares. The screen pair extends it with
 * nesting and the chrome a page is navigated by.
 */

import { slugify, toKebabCase } from "@/utils/str";
import type { Link } from "@/types";
import type { AssembledBlueprint, AssembledPart, AssembledSection, BlueprintPart, BlueprintSchema, NestedKeys, PartContent, SectionData } from "./schema";
import type { BlueprintEntry, BlueprintEntryPartial } from "./types";

export type { AssembledBlueprint, AssembledPart, AssembledSection, BlueprintComponent, BlueprintComponentSchema, BlueprintPart, BlueprintSchema, PartContent, SectionData } from "./schema";

/** Parsed Blueprint Schema */
export type ParsedBlueprint = BlueprintSectionProxy[];

/** A part walked by key: the section, with its own data readable off it. */
export type BlueprintPartProxy<D extends BlueprintPart<unknown>> = BlueprintPartSection<D> & D;

/** */
type BlueprintProxy<T extends BlueprintSchema<unknown>> = BlueprintBuilder<T> & Record<NestedKeys<T>, BlueprintSectionProxy>;

/** */
type BlueprintSectionProxy = BlueprintSection & SectionData;

/**
 * Walk a structure of parts by key.
 *
 * A part is a leaf, so this caches what it parses and nothing else. A medium
 * that nests overrides the two protected hooks rather than reimplementing the
 * walk.
 */
export class BlueprintPartBuilder<T extends BlueprintSchema<unknown>, S extends BlueprintPartSection<any> = BlueprintPartProxy<BlueprintPart>> {
	protected cache: Map<string, S>;
	protected parsedSections: S[];

	constructor(structure: T) {
		this.parsedSections = this.parseSections(structure);
		this.cache = new Map();
		this.buildCache(this.parsedSections);
	}

	/** Build one section. The hook a nesting medium overrides. */
	protected createSection(key: string, section: BlueprintPart<unknown>): S {
		return proxySection(new BlueprintPartSection({ ...section, id: key })) as unknown as S;
	}

	/** Parse schema */
	protected parseSections(structure: BlueprintSchema<unknown>): S[] {
		return Object.entries(structure).map(([key, section]) => this.createSection(key, section));
	}

	/** Cache all sections. The hook a nesting medium overrides. */
	protected buildCache(sections: S[]): void {
		sections.forEach((section) => this.cache.set(section.key, section));
	}

	/** Get a section by key */
	getByKey<K extends NestedKeys<T>>(key: K): S {
		return this.cache.get(key as string)!;
	}

	/** Get all keys */
	getKeys(): Array<NestedKeys<T>> {
		return Array.from(this.cache.keys()) as Array<NestedKeys<T>>;
	}

	/** Gets the parsed schema */
	getBlueprint(): S[] {
		return this.parsedSections;
	}

	/** Filter parts */
	filter(predicate: (part: S) => boolean): S[] {
		return this.parsedSections.filter(predicate);
	}

	/** Map parts */
	map(predicate: (part: S) => S): S[] {
		return this.parsedSections.map(predicate);
	}

	/** Every part the structure does not hide */
	getVisibleParts(): S[] {
		return this.filter((part) => !part.get("hidden"));
	}

	/** Assemble every part into inert display data */
	assembleParts(): AssembledPart[] {
		return this.parsedSections.map((section) => section.assemblePart());
	}
}

/** Build a screen Blueprint from a schema */
export class BlueprintBuilder<T extends BlueprintSchema<unknown>> extends BlueprintPartBuilder<T, BlueprintSectionProxy> {
	/** Static method to create proxied instance */
	static createProxyFromStructure<T extends BlueprintSchema<unknown>>(structure: T): BlueprintProxy<T> {
		const builder = new BlueprintBuilder(structure);
		return BlueprintBuilder.createProxy(builder);
	}

	/** Static method to create proxied instance */
	static createProxy<T extends BlueprintSchema<unknown>>(builder: BlueprintBuilder<T>): BlueprintProxy<T> {
		return new Proxy(builder, {
			get: (target: BlueprintBuilder<T>, prop: string | symbol) => {
				if (prop in target) {
					return target[prop as keyof typeof target];
				}
				const section = target.getByKey(prop as NestedKeys<T>);
				if (section) {
					return target.createSection(section.key, section.getData());
				}
				return undefined;
			},
		}) as BlueprintProxy<T>;
	}

	protected override createSection(key: string, section: BlueprintPart<unknown>): BlueprintSectionProxy {
		return BlueprintSection.createProxy(new BlueprintSection({ ...(section as SectionData), id: key }));
	}

	/** Nested sections are keyed alongside their parents, so a lookup reaches them. */
	protected override buildCache(sections: ParsedBlueprint): void {
		sections.forEach((section) => {
			this.cache.set(section.key, section);
			if ((section.sections ?? []).length > 0) {
				this.buildCache((section.sections ?? []) as ParsedBlueprint);
			}
		});
	}

	/** Gets all direct children of a blueprint section */
	getSectionsByParentKey(parentKey: NestedKeys<T>): BlueprintSection[] {
		const parent = this.getByKey(parentKey);
		return parent.getSections();
	}

	/** Map while preserving structure */
	static map(sections: ParsedBlueprint, predicate: (section: BlueprintSectionProxy) => BlueprintSectionProxy): ParsedBlueprint {
		return sections
			.map((section) => {
				// Create a new section with mapped subsections
				const mappedSection = BlueprintSection.createProxy(
					new BlueprintSection({
						...section.getData(),
						content:
							section.sections && section.sections.length > 0
								? {} // Empty object for nested structure
								: section.content,
					}),
				);

				// Recursively map subsections if they exist
				if (section.sections && section.sections.length > 0) {
					const mappedSubsections = this.map(section.sections as ParsedBlueprint, predicate);
					if (mappedSubsections.length > 0) {
						(mappedSection as any).sections = mappedSubsections;
					}
				}

				return mappedSection;
			})
			.map(predicate);
	}

	/** Filter while preserving structure */
	static filter(sections: ParsedBlueprint, predicate: (section: BlueprintSectionProxy) => boolean): ParsedBlueprint {
		return sections
			.map((section) => {
				// Create a new section with filtered subsections
				const filteredSection = BlueprintSection.createProxy(
					new BlueprintSection({
						...section.getData(),
						content:
							section.sections && section.sections.length > 0
								? {} // Empty object for nested structure
								: section.content,
					}),
				);

				// Recursively filter subsections if they exist
				if (section.sections && section.sections.length > 0) {
					const filteredSubsections = this.filter(section.sections as ParsedBlueprint, predicate);
					if (filteredSubsections.length > 0) {
						(filteredSection as any).sections = filteredSubsections;
					}
				}

				return filteredSection;
			})
			.filter((section) => {
				// Keep section if it matches predicate or has matching subsections
				return predicate(section) || (section.sections && section.sections.length > 0);
			});
	}

	/** Filter blueprint, recursing into nested sections */
	override filter(predicate: (section: BlueprintSectionProxy) => boolean): ParsedBlueprint {
		return BlueprintBuilder.filter(this.parsedSections, predicate);
	}

	/** Map blueprint, recursing into nested sections */
	override map(predicate: (section: BlueprintSectionProxy) => BlueprintSectionProxy): ParsedBlueprint {
		return BlueprintBuilder.map(this.parsedSections, predicate);
	}

	/** Assemble parsed Blueprint sections */
	static assemble(blueprint: ParsedBlueprint): AssembledBlueprint {
		return blueprint.map((section) => section.assemble());
	}

	/** Assemble parsed Blueprint sections */
	static menuLinks(blueprint: ParsedBlueprint): Link[] {
		return blueprint.map((section) => section.convertToMenuLink());
	}

	/** Assemble all Blueprint sections */
	assemble(): AssembledBlueprint {
		return BlueprintBuilder.assemble(this.parsedSections);
	}

	/** Get Parent Sections */
	getParentSections(): BlueprintSectionProxy[] {
		const cache = Array.from(this.cache.values());

		let parents: BlueprintSectionProxy[] = [];
		for (const section of cache) {
			if (!!section.sections?.length) {
				parents.push(section);
			}
		}
		return parents;
	}

	/** Get all sidebar sections recursively */
	getSidebarSections(): ParsedBlueprint {
		return this.filter((d) => !!d.showInSidebar);
	}
}

/**
 * Read a section's own data straight off the section.
 *
 * Shared by both pairs rather than inherited: a static cannot be narrowed on
 * the way down, and the screen pair needs its own return type.
 */
function proxySection<D extends BlueprintPart<unknown>, S extends BlueprintPartSection<any>>(section: S): S & D {
	return new Proxy(section, {
		get(target: S, prop: PropertyKey) {
			if (prop in target) {
				return target[prop as keyof S];
			}
			const data = target.getData() as Record<PropertyKey, unknown>;
			if (prop in data) {
				return data[prop];
			}
			return undefined;
		},
	}) as S & D;
}

/**
 * A section, in the terms every medium shares.
 *
 * It is a leaf: it holds its own data and answers for it. Nesting, chrome and
 * anything a page is navigated by belong to the medium that has them.
 */
export class BlueprintPartSection<D extends BlueprintPart<unknown> = BlueprintPart<unknown>> {
	protected data: D;
	readonly key: string;

	constructor(data: D) {
		this.data = {
			...data,
			description: data.description || "",
			id: slugify(toKebabCase(data.id || data.title)),
		};

		this.key = data.id || "";
	}

	/** Get the raw data */
	getData(): D {
		return this.data;
	}

	/** Get a value from the data */
	get<K extends keyof D>(key: K): D[K] {
		return this.data[key];
	}

	/** Map the data to inert display data */
	assemblePart(): AssembledPart {
		return {
			id: this.data.id || "",
			title: this.data.title,
			description: this.data.description,
			eyebrow: this.data.eyebrow,
			content: this.data.content as PartContent,
			hidden: !!this.data.hidden,
		};
	}
}

/** A section on an indexed screen page: chrome, and the sections nested under it. */
export class BlueprintSection extends BlueprintPartSection<SectionData> {
	readonly sections?: BlueprintSection[];

	constructor(data: SectionData) {
		super({
			showInSidebar: data.showInSidebar ?? true,
			// showInSearch: data.showInSearch ?? true,
			...data,
			mainMenuLabel: data.mainMenuLabel || data.title,
		});

		this.data.href = `#${this.data.id}`;

		// If content is a nested schema and not a function or string then parse the sections
		if (data.content instanceof Object && !(data.content instanceof Function)) {
			this.sections = Object.entries(data.content as Record<string, SectionData>).map(([key, section]) =>
				BlueprintSection.createProxy(
					new BlueprintSection({
						...section,
						id: key,
					}),
				),
			);
			this.data.content = "";
		} else {
			this.sections = [];
		}
	}

	/** Static method to create proxied instance */
	static createProxy(section: BlueprintSection): BlueprintSectionProxy {
		return proxySection<SectionData, BlueprintSection>(section);
	}

	/** Get sections */
	getSections(): BlueprintSection[] {
		return this.sections || [];
	}

	hasSections(): boolean {
		return this.getSections().length > 0;
	}

	/** Negative indexes count back from the end. */
	getSection(index: number): BlueprintSectionProxy | undefined {
		const sections = this.getSections();
		const section = sections.at(index);
		return section ? BlueprintSection.createProxy(section) : undefined;
	}

	getFirstSection(): BlueprintSectionProxy | undefined {
		return this.getSection(0);
	}

	/** Map the data to a type we can build with */
	assemble(): AssembledSection {
		return {
			...(this.data.props ?? {}),
			id: this.data.id || "",
			icon: this.data.icon || "",
			content: this.data.content as AssembledSection["content"],
			sections: this.sections?.map((section) => section.assemble()) || [],
			hidden: !!this.data.hidden,
			// showInSearch: this.data.showInSearch ?? true,
			header: {
				...((this.data.props ?? {})?.header ?? {}),
				title: this.data.title,
				subtitle: this.data.description,
				eyebrow: this.data.eyebrow,
			},
		} as AssembledSection;
	}

	/** Convert to Menu Link for use in navigation */
	convertToMenuLink(overrides: Partial<Link> = {}): Link {
		return {
			id: this.data.id || "",
			icon: this.data.icon || "",
			text: this.data.mainMenuLabel ?? this.data.title ?? "",
			href: `#${this.data.id}`,
			...overrides,
		};
	}
}

/** Build a blueprint from a schema. Cross-cutting metadata (search scoping,
 *  layout chrome) lives on the catalog `BlueprintEntry`, not here. */
export function buildParts<T extends BlueprintSchema>(structure: T): BlueprintPartBuilder<T> {
	return new BlueprintPartBuilder(structure);
}

export function buildBlueprint<T extends BlueprintSchema<unknown>>(structure: T): BlueprintProxy<T> {
	return BlueprintBuilder.createProxyFromStructure(structure);
}

export function buildBlueprintEntry(entry: BlueprintEntryPartial): BlueprintEntry {
	return {
		...entry,
		slug: entry.slug ?? slugify(toKebabCase(entry.title)),
		blueprint: entry.blueprint instanceof BlueprintBuilder ? entry.blueprint : buildBlueprint(entry.blueprint),
	};
}

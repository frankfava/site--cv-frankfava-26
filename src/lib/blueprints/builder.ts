/**
 * Assembling a blueprint: the builder, the section, and the proxies that let a
 * structure be walked by key.
 *
 * The two classes call each other - `BlueprintBuilder` creates sections via
 * `BlueprintSection.createProxy`, and the section calls back - so they stay in
 * one module. Splitting them would turn a type-only relationship into a real
 * circular import. The data shapes live in `./types`.
 */

import { slugify, toKebabCase } from "@/utils/str";
import type { Link } from "@/types";
import type { AssembledBlueprint, AssembledSection, BlueprintComponent, BlueprintSchema, NestedKeys } from "./schema";

export type { AssembledBlueprint, AssembledSection, BlueprintComponent, BlueprintSchema } from "./schema";

/** Parsed Blueprint Schema */
export type ParsedBlueprint = BlueprintSectionProxy[];

/** */
type BlueprintProxy<T extends BlueprintSchema> = BlueprintBuilder<T> & Record<NestedKeys<T>, BlueprintSectionProxy>;

/** */
type BlueprintSectionProxy = BlueprintSection & BlueprintComponent;

/** Build Blueprint from schema */
export class BlueprintBuilder<T extends BlueprintSchema> {
	private cache: Map<string, BlueprintSectionProxy>;
	private parsedSections: ParsedBlueprint;

	constructor(structure: T) {
		this.parsedSections = this.parseSections(structure);
		this.cache = new Map();
		this.buildCache(this.parsedSections);
	}

	/** Static method to create proxied instance */
	static createProxyFromStructure<T extends BlueprintSchema>(structure: T): BlueprintProxy<T> {
		const builder = new BlueprintBuilder(structure);
		return BlueprintBuilder.createProxy(builder);
	}

	/** Static method to create proxied instance */
	static createProxy<T extends BlueprintSchema>(builder: BlueprintBuilder<T>): BlueprintProxy<T> {
		return new Proxy(builder, {
			get: (target: BlueprintBuilder<T>, prop: string | symbol) => {
				if (prop in target) {
					return target[prop as keyof typeof target];
				}
				const section = target.getByKey(prop as NestedKeys<T>) as BlueprintSectionProxy;
				if (section) {
					return target.parseSection(section.key, section?.getData());
				}
				return undefined;
			},
		}) as BlueprintProxy<T>;
	}

	/** Cache all sections */
	private buildCache(sections: ParsedBlueprint): void {
		sections.forEach((section) => {
			this.cache.set(section.key, section);
			if ((section.sections ?? []).length > 0) {
				this.buildCache((section.sections ?? []) as ParsedBlueprint);
			}
		});
	}

	/** Recursively parse schema */
	private parseSections(structure: BlueprintSchema): ParsedBlueprint {
		return Object.entries(structure).map(([key, section]) => this.parseSection(key, section));
	}

	/** Parse Section to BlueprintSection */
	private parseSection(key: string, section: BlueprintComponent): BlueprintSectionProxy {
		return BlueprintSection.createProxy(new BlueprintSection({ ...section, id: key }));
	}

	/** Get a section by key */
	getByKey<K extends NestedKeys<T>>(key: K): BlueprintSectionProxy {
		return this.cache.get(key as string)!;
	}

	/** Get all keys */
	getKeys(): Array<NestedKeys<T>> {
		return Array.from(this.cache.keys()) as Array<NestedKeys<T>>;
	}

	/** Gets the parsed schema */
	getBlueprint(): ParsedBlueprint {
		return this.parsedSections;
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

	/** Filter blueprint */
	filter(predicate: (section: BlueprintSectionProxy) => boolean): ParsedBlueprint {
		return BlueprintBuilder.filter(this.parsedSections, predicate);
	}

	/** Map blueprint */
	map(predicate: (section: BlueprintSectionProxy) => BlueprintSectionProxy): ParsedBlueprint {
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

	/** Get all bookmarked sections */
	getBookmarkedSections(): BlueprintSectionProxy[] {
		const cache = Array.from(this.cache.values());

		let bookmarks: BlueprintSectionProxy[] = [];
		for (const section of cache) {
			if (section.getData().bookmark) {
				bookmarks.push(section);
			}
		}
		return bookmarks;
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

	/** Get all bookmarked sections recursively */
	getSidebarSections(): ParsedBlueprint {
		return this.filter((d) => !!d.showInSidebar);
	}
}

/** Blueprint Section */
export class BlueprintSection {
	private data: BlueprintComponent;
	readonly key: string;
	readonly sections?: BlueprintSection[];

	constructor(data: BlueprintComponent) {
		this.data = {
			showInSidebar: data.showInSidebar ?? true,
			// showInSearch: data.showInSearch ?? true,
			bookmark: !!data.bookmark,
			...data,
			description: data.description || "",
			mainMenuLabel: data.mainMenuLabel || data.title,
			bookmarkDesc: data.bookmarkDesc || "",
			id: slugify(toKebabCase(data.id || data.title)),
		};

		this.data.href = `#${this.data.id}`;

		this.key = data.id || "";

		// If content is a nested schema and not a function or string then parse the sections
		if (data.content instanceof Object && !(data.content instanceof Function)) {
			this.sections = Object.entries(data.content as BlueprintSchema).map(([key, section]) =>
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
		return new Proxy(section, {
			get(target: BlueprintSection, prop: PropertyKey) {
				if (prop in target) {
					return target[prop as keyof BlueprintSection];
				}
				if (prop in target.data) {
					const key = prop as keyof BlueprintComponent;
					return target.data[key];
				}
				return undefined;
			},
		}) as BlueprintSectionProxy;
	}

	/** Get the raw data */
	getData(): BlueprintComponent {
		return this.data;
	}

	/** Get a value from the data */
	get<K extends keyof BlueprintComponent>(key: K): BlueprintComponent[K] {
		return this.data[key];
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
export function buildBlueprint<T extends BlueprintSchema>(structure: T): BlueprintProxy<T> {
	return BlueprintBuilder.createProxyFromStructure(structure);
}

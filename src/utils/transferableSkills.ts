import type { AstroInstance } from "astro";
import { CollectionManager } from "@/lib/collections/collectionManager";

/**
 * Frontmatter shape exported by every `src/data/transferableSkills/*.astro`.
 * Authored as `export const meta: TransferableSkillMeta = { … }` in each file
 * so TypeScript catches missing/typo'd fields at author time.
 */
export type TransferableSkillMeta = {
	title: string;
	summary?: string;
	short?: string;
	icon?: string;
	featured?: boolean;
	order?: number;
	keywords?: string[];
};

export namespace TransferableSkills {
	export type Meta = TransferableSkillMeta;
	export type Component = AstroInstance["default"];

	/** A registry entry. `data` holds the meta (matches CollectionManager's `{id,data}` contract). */
	export type Entry = {
		id: string;
		data: Meta;
		Component: Component;
	};
	export type Collection = Entry[];

	/** Flattened view (id + meta + Component) for templating ergonomics. */
	export type Sanitised = { id: string; Component: Component } & Meta;
}

type RawModule = AstroInstance & { meta?: TransferableSkillMeta };

const modules = import.meta.glob<RawModule>("../data/transferableSkills/*.astro", { eager: true });

const REGISTRY: TransferableSkills.Collection = Object.entries(modules)
	.map(([path, mod]) => {
		const id = path.replace(/.*\/([^/]+)\.astro$/, "$1");
		if (!mod.meta || typeof mod.meta.title !== "string") {
			throw new Error(`[transferableSkills] ${path} must export a \`meta\` object with at least a \`title\`.`);
		}
		return { id, data: mod.meta, Component: mod.default };
	})
	.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

/** Get all transferable skills from the registry (eager - no I/O). */
export const getTransferableSkills = (): TransferableSkills.Collection => REGISTRY;

/** Look up a single entry by id (used by role pages). */
export const getTransferableSkillById = (id: string): TransferableSkills.Entry | undefined => REGISTRY.find((e) => e.id === id);

/** Convenience factory mirroring the other collection managers. */
export function createTransferableSkillsManager(): Manager {
	return new Manager();
}

/** Helper to manage transferable skills (sort/filter/restructure). */
export class Manager extends CollectionManager<string, TransferableSkills.Meta, TransferableSkills.Entry, TransferableSkills.Sanitised> {
	constructor(entries: TransferableSkills.Collection = REGISTRY) {
		super(entries);
	}

	sort(key: keyof TransferableSkills.Meta = "order", ascending: boolean = true): this {
		return super.sort(key, ascending);
	}

	protected override restructureItem(item: TransferableSkills.Entry): TransferableSkills.Sanitised {
		return { id: item.id, Component: item.Component, ...item.data };
	}
}

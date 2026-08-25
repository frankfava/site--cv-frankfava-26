import { getCollection, type CollectionEntry } from "astro:content";
import type { SkillId, SkillKeyword } from "content:ids";
import { CollectionManager } from "./collectionManager";

export namespace Skills {
	export type Entry = {
		id: SkillId;
		data: {
			proficiency: Proficiency;
			keywords: SkillKeyword[];
			relevance: RelevanceOption[];
		} & Omit<CollectionEntry<"skills">["data"], "keywords" | "proficiency" | "relevance">;
	} & Omit<CollectionEntry<"skills">, "id">;

	export type Collection = Entry[];

	/** Single item to combine id and data */
	export type Simple = { id: SkillId } & Skills.Entry["data"];

	export type RelevanceOption = {
		key: CollectionEntry<"skills">["data"]["relevance"][number];
		label: string;
		description?: string;
	};

	export type Proficiency = {
		key: CollectionEntry<"skills">["data"]["proficiency"];
		label: string;
		description?: string;
	};
}

/** Get all skills from content collection */
export const getSkills = async (): Promise<Skills.Collection> => {
	return await getCollection("skills");
};

/** Get Collection and add to class for manipulation */
export async function createSkillsManager() {
	const skills = await getSkills();
	return new Manager(skills);
}

/** Helper to manage skills */
export class Manager extends CollectionManager<SkillId, Skills.Entry["data"], Skills.Entry, Skills.Simple> {
	constructor(skills: Skills.Collection | CollectionEntry<"skills">[]) {
		super([]);
		this.setData(skills);
	}

	/** Set list */
	setData(skills: Skills.Collection | CollectionEntry<"skills">[]): this {
		this.list = skills.map((skill: CollectionEntry<"skills">) => {
			return {
				...skill,
				id: skill.id,
				data: {
					...skill.data,
					yrsExperience: skill.data.yrsExperience ?? null,
					proficiency: { ...Manager.getProficiency(skill.data.proficiency), description: undefined },
					relevance: skill.data.relevance.map((r) => ({ ...Manager.getRelevance(r), description: undefined })),
					keywords: (Array.isArray(skill.data.keywords) ? skill.data.keywords : [skill.data.keywords]).filter(Boolean),
				},
			} as Skills.Entry;
		});
		return this;
	}

	/** Get list */
	_get(): Skills.Collection {
		return this.list;
	}

	/** Sort skills */
	sort(key: keyof Skills.Entry["data"] | "default" = "default", ascending: boolean = true): this {
		if (key === "default") {
			this.list = Manager.sortSkills(this.list, !ascending);
			return this;
		}

		if (key === "proficiency") {
			const proficiencyOrder = ["expert", "senior", "proficient", "beginner"];
			this.list = this.list.sort((a, b) => {
				const aIndex = proficiencyOrder.indexOf(a.data.proficiency.key);
				const bIndex = proficiencyOrder.indexOf(b.data.proficiency.key);
				return ascending ? aIndex - bIndex : bIndex - aIndex;
			});
			return this;
		}

		if (key === "relevance") {
			// Composite score: active_stack=−100 (top), shipped=−10, peripheral=+1 (demoter).
			// Sort ascending = best signal first.
			const score = (tags: string[] = []) => {
				let s = 0;
				if (tags.includes("active_stack")) s -= 100;
				if (tags.includes("shipped")) s -= 10;
				if (tags.includes("peripheral")) s += 1;
				return s;
			};
			this.list = this.list.sort((a, b) => {
				const diff = score(a.data.relevance) - score(b.data.relevance);
				return ascending ? diff : -diff;
			});
			return this;
		}

		return super.sort(key, ascending);
	}

	/** Filter out skills tagged with any of the given relevance tags. Chainable. */
	excludeRelevance(...tags: Skills.RelevanceOption["key"][]): this {
		this.list = this.list.filter((skill) => !(skill.data.relevance ?? []).some((t) => tags.includes(t.key)));
		return this;
	}

	/** Keep only skills tagged with at least one of the given relevance tags. Chainable. */
	requireRelevance(...tags: Skills.RelevanceOption["key"][]): this {
		this.list = this.list.filter((skill) => (skill.data.relevance ?? []).some((t) => tags.includes(t.key)));
		return this;
	}

	/** Restructure data to combine id and data */
	_restructure(): Skills.Simple[] {
		return super._restructure();
	}

	/** Restructure data to combine id and data */
	_restructureItem(item: Skills.Entry): Skills.Simple {
		return this.restructureItem(item);
	}

	/** Find By Keyword */
	_findByKeyword(keyword: SkillKeyword): Skills.Collection {
		return this.list.filter((skill) => skill.data.keywords.includes(keyword));
	}

	/** Get proficiency data */
	static getProficiency(key: Skills.Proficiency["key"]): Skills.Proficiency | undefined {
		const proficiencies = this.getProficiencies();
		return proficiencies.find((p) => p.key == key) ?? undefined;
	}

	/** Get relevance data */
	static getRelevance(key: Skills.RelevanceOption["key"]): Skills.RelevanceOption | undefined {
		const relevanceOptions = this.getRelevanceOptions();
		return relevanceOptions.find((o) => o.key == key) ?? undefined;
	}

	/** Get array of available proficiencies */
	static getProficiencies(): Skills.Proficiency[] {
		const proficiencies: Skills.Proficiency[] = [];

		["beginner", "proficient", "senior", "expert"].forEach((key) => {
			let out: Skills.Proficiency = { key: key as Skills.Proficiency["key"], label: key as string };

			switch (key) {
				case "beginner":
					out.label = "Beginner";
					out.description = "Used this skill in the past, but not in a professional capacity";
					break;
				case "proficient":
					out.key = "proficient";
					out.label = "Proficient";
					out.description = "Well versed in using this skill, and can navigate most tasks without difficulty";
					break;
				case "senior":
					out.key = "senior";
					out.label = "Senior";
					out.description = "Extensive experience using this skill professionally and can mentor others";
					break;
				case "expert":
					out.label = "Expert";
					out.description = "Mastery of this skill with deep understanding of its intricacies, able to innovate and teach others at an advanced level";
					break;
			}
			proficiencies.push(out);
		});

		return proficiencies;
	}

	/** Get array of available proficiencies */
	static getRelevanceOptions(): Skills.RelevanceOption[] {
		const relevanceOptions: Skills.RelevanceOption[] = [];

		["active_stack", "shipped", "peripheral"].forEach((key) => {
			let out: Skills.RelevanceOption = {
				key: key as Skills.RelevanceOption["key"],
				label: key as string,
			};

			switch (key) {
				case "active_stack":
					out.label = "Active stack";
					out.description = "What I'm working with right now";
					break;
				case "shipped":
					out.label = "Shipped in production";
					out.description = "Used in real production work.";
					break;
				case "peripheral":
					out.label = "Peripheral / tooling";
					out.description = "Stack tooling, dev workflow, long-tail libs.";
					break;
			}
			relevanceOptions.push(out);
		});

		return relevanceOptions;
	}

	/** Restructure data of single item to combine id and data */
	protected override restructureItem(item: Skills.Entry): Skills.Simple {
		return {
			id: item.id,
			...item.data,
		} as Skills.Simple;
	}

	static sortSkills(skills: Skills.Collection | CollectionEntry<"skills">[], flip: boolean = false): Skills.Collection {
		const skillOrder = skills.map((s: CollectionEntry<"skills">) => s.id);
		skills = skills.sort((a, b) => {
			const aIndex = skillOrder.indexOf(a.id);
			const bIndex = skillOrder.indexOf(b.id);
			return !flip ? aIndex - bIndex : bIndex - aIndex;
		});
		return skills as Skills.Collection;
	}
}

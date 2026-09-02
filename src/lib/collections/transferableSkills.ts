import { getCollection, type CollectionEntry } from "astro:content";
import type { TransferableSkillId } from "content:ids";
import { ABOUT } from "site:config";

export namespace TransferableSkills {
	export type Entry = { id: TransferableSkillId } & Omit<CollectionEntry<"transferableSkills">, "id">;
	export type Collection = Entry[];
}

/** Summaries the entry cannot author because they read from site config. */
const COMPUTED_SUMMARIES: Partial<Record<TransferableSkillId, string>> = {
	languages: ABOUT.linguistics.languages.map(({ language, fluency }) => (fluency ? `${language} (${fluency})` : language)).join(" · "),
};

const withSummary = (skill: TransferableSkills.Entry): TransferableSkills.Entry => ({
	...skill,
	data: { ...skill.data, summary: COMPUTED_SUMMARIES[skill.id] ?? skill.data.summary },
});

/** Every transferable skill, in authored order. */
export async function getTransferableSkills(): Promise<TransferableSkills.Collection> {
	const skills: TransferableSkills.Collection = await getCollection("transferableSkills");
	return skills.map(withSummary).sort((a, b) => a.data.order - b.data.order);
}

/** The named skills, in the order asked for. Unknown ids are dropped. */
export async function getTransferableSkillsByIds(ids: readonly TransferableSkillId[]): Promise<TransferableSkills.Collection> {
	const skills = await getCollection("transferableSkills");
	const byId = new Map(skills.map((skill) => [skill.id, skill]));
	return ids
		.map((id) => byId.get(id))
		.filter((skill): skill is TransferableSkills.Entry => !!skill)
		.map(withSummary);
}

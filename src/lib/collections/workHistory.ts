import { getCollection, type CollectionEntry } from "astro:content";
import type { WorkHistoryId } from "content:ids";
import { CollectionManager } from "./collectionManager";

export namespace WorkHistory {
	export type Entry = { id: WorkHistoryId } & Omit<CollectionEntry<"workHistory">, "id">;
	export type Collection = Entry[];
	/** Single item to combine id and data */
	export type Sanitised = {
		id: WorkHistoryId;
		skills: Partial<CollectionEntry<"skills">>[];
	} & WorkHistory.Entry["data"];
}

/** Get all workHistory from content collection */
export async function getWorkHistory(): Promise<WorkHistory.Collection> {
	return await getCollection("workHistory");
}

/** Get Collection and add to class for manipulation */
export async function createWorkHistoryManager() {
	const workHistory = await getWorkHistory();
	return new Manager(workHistory);
}

/** Helper to manage certifications */
export class Manager extends CollectionManager<WorkHistoryId, WorkHistory.Entry["data"], WorkHistory.Entry, WorkHistory.Sanitised> {
	constructor(workHistory: WorkHistory.Collection) {
		super(workHistory);
	}

	/** Sort work history */
	sort(key: keyof WorkHistory.Entry["data"] = "startDate", ascending: boolean = false): this {
		return super.sort(key, ascending);
	}

	/**
	 * Sum months across roles matching `predicate`, clamped to [since, until].
	 * Roles starting before `since` are clamped forward; roles still in
	 * progress (no `endDate`) clamp to `until` (defaults to now).
	 *
	 * Used for narrative stats like "X of the last Y years self-employed"
	 * without hardcoding ranges in the page.
	 */
	monthsMatching(predicate: (entry: WorkHistory.Sanitised) => boolean, since: Date, until: Date = new Date()): number {
		return this._restructure().reduce((acc, entry) => {
			if (!predicate(entry)) return acc;
			const start = entry.startDate < since ? since : entry.startDate;
			const endRaw = entry.endDate ?? until;
			const end = endRaw > until ? until : endRaw;
			if (end <= start) return acc;
			return acc + (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
		}, 0);
	}

	/** Earliest `startDate` across all entries - useful as the lower bound
	 *  for "since {year}" narrative copy. Returns undefined for empty lists. */
	earliestStart(): Date | undefined {
		if (!this.list.length) return undefined;
		return new Date(Math.min(...this.list.map((e) => +e.data.startDate)));
	}

	/** Restructure data to combine id and data */
	_restructure(): WorkHistory.Sanitised[] {
		return super._restructure();
	}

	/** Restructure data of single item to combine id and data */
	protected override restructureItem(item: WorkHistory.Entry): WorkHistory.Sanitised {
		return { id: item.id, skills: item.data?.skills ?? [], ...item.data } as WorkHistory.Sanitised;
	}
}

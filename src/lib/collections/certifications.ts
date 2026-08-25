import { getCollection, type CollectionEntry } from "astro:content";
import type { CertificationId } from "content:ids";
import { CollectionManager } from "./collectionManager";

export namespace Certifications {
	export type Entry = { id: CertificationId } & Omit<CollectionEntry<"certifications">, "id">;
	export type Collection = Entry[];

	/** Single item to combine id and data */
	export type Sanitised = {
		id: CertificationId;
	} & Certifications.Entry["data"];
}

/** Get all certificates from content collection */
export const getCertifications = async (): Promise<Certifications.Collection> => {
	return await getCollection("certifications");
};

/** Get Collection and add to class for manipulation */
export async function createCertificationsManager() {
	const certifications = await getCertifications();
	return new Manager(certifications);
}

/** Helper to manage certifications */
export class Manager extends CollectionManager<CertificationId, Certifications.Entry["data"], Certifications.Entry, Certifications.Sanitised> {
	constructor(certifications: Certifications.Collection) {
		super(certifications);
	}

	/** Sort certifications */
	sort(key: keyof Certifications.Entry["data"] = "issueDate", ascending: boolean = false): this {
		return super.sort(key, ascending);
	}

	/** Restructure data of single item to combine id and data */
	protected override restructureItem(item: Certifications.Entry): Certifications.Sanitised {
		return { id: item.id, ...item.data } as Certifications.Sanitised;
	}
}

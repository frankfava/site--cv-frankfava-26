import { getCollection, type CollectionEntry } from "astro:content";
import type { TestimonialId } from "content:ids";

export namespace Testimonials {
	export type Entry = { id: TestimonialId } & Omit<CollectionEntry<"testimonials">, "id">;
	export type Collection = Entry[];
}

/** Every testimonial, in the order the column reads them. */
export async function getTestimonials(): Promise<Testimonials.Collection> {
	const testimonials: Testimonials.Collection = await getCollection("testimonials");
	return testimonials.sort((a, b) => a.data.order - b.data.order);
}

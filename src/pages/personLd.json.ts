import type { APIRoute } from "astro";
import { buildPersonJsonLd } from "@/lib/personJsonLd";

const personJsonLd = await buildPersonJsonLd();

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify(personJsonLd, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

import type { APIRoute } from "astro";
import CONFIG from "site:config";

export const GET: APIRoute = async () => {
	if (import.meta.env.PROD) {
		return new Response(null, { status: 404 });
	}
	return new Response(JSON.stringify(CONFIG, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

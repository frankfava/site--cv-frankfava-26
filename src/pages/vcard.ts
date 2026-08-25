import type { APIRoute } from "astro";
import { buildVcard } from "@/lib/vcard";

export const prerender = false;

export const GET: APIRoute = async ({}) => {
	const vCardContent: string = buildVcard();
	return new Response(vCardContent, {
		status: 200,
		headers: {
			"Content-Type": "text/vcard",
			"Content-Disposition": 'attachment; filename="frankfava.vcf"',
		},
	});
};

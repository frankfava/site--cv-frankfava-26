import { getCertifications } from "@/lib/collections/certifications";
import { ATOMIC_ICON } from "./icons";
import type { AtomicBuilder } from "./types";

export const certificationItems: AtomicBuilder = async (renderIcon, { url, module, page }) => {
	const certifications = await getCertifications();
	return Promise.all(
		certifications.map(async ({ id, data }) => ({
			id: `certification:${id}`,
			url,
			title: data.certificate,
			description: [data.issuer, data.ranking].filter(Boolean).join(" · "),
			// The collection's own `icon` is an issuer logo rather than a name this can render.
			iconHtml: await renderIcon(ATOMIC_ICON.certification),
			module,
			page,
			body: [data.certificate, data.issuer, data.ranking, data.credentialId].filter(Boolean).join(" "),
			kind: "certification" as const,
			isGroup: false,
		})),
	);
};

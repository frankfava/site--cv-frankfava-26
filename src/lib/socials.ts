import type { Socials } from "@/types";
import { defu } from "defu";

/** Helper to manage socials */
export class SocialsManager {
	private socials: Socials.Links;

	constructor(socials: Socials.Links) {
		this.socials = this.mapPlatforms(socials);
	}

	get(): Socials.Links {
		return this.socials;
	}

	toArray(): Socials.Link[] {
		return Object.values(this.get());
	}

	getPlatforms(): Socials.LinkKey[] {
		return Object.keys(this.socials) as Socials.LinkKey[];
	}

	getPlatform(key: Socials.LinkKey): Socials.Link | undefined {
		if (this.getPlatforms().includes(key)) {
			return this.socials[key] as Socials.Link;
		}
		return undefined;
	}

	clone(): SocialsManager {
		return new SocialsManager(this.socials);
	}

	/** Filter certification by predicate */
	filter(predicate: ([key, item]: [Socials.LinkKey, Socials.Link]) => boolean): this {
		this.socials = Object.fromEntries(Object.entries(this.socials).filter(predicate));
		return this;
	}

	private mapPlatforms(socials: Socials.Links): Socials.Links {
		let platforms: Socials.Links = {};
		Object.entries(availableSocials).forEach(([k, d]) => {
			if (typeof d == "function") {
				d = d(socials[k]) as Partial<Socials.Link>;
			}
			if (socials[k as Socials.LinkKey] !== undefined) {
				platforms[k as Socials.LinkKey] = defu(d ?? {}, socials[k] ?? {}, { displayable: true }) as Socials.Link;
			}
		});
		return platforms;
	}
}

/** Define available socials and their icons */
const availableSocials: Record<Socials.LinkKey, Partial<Socials.Link> | ((value: Partial<Socials.Link>) => Partial<Socials.Link>)> = {
	email: (v) => ({
		label: "Email",
		icon: "ph:envelope-open",
		"data-copy": (v.href ?? "").replace("mailto:", ""),
		class: "copy-to-clipboard",
	}),
	phone: {
		label: "Phone",
		icon: "ph:phone-incoming",
	},
	github: {
		label: "GitHub",
		icon: "ph:github-logo",
	},
	linkedin: {
		label: "LinkedIn",
		icon: "ph:linkedin-logo",
	},
	facebook: {
		label: "Facebook",
		icon: "ph:facebook-logo",
	},
	x: {
		label: "X",
		icon: "ph:x-logo",
	},
	youtube: {
		label: "YouTube",
		icon: "ph:youtube-logo",
	},
	codepen: {
		label: "CodePen",
		icon: "ph:codepen-logo",
	},
	whatsapp: {
		label: "WhatsApp",
		icon: "ph:whatsapp-logo",
	},
	vcard: {
		label: "vCard",
		text: "Download vCard (vcf)",
		icon: "ph:identification-card",
		displayable: false,
	},
};

/** Create instance of Socials Manager */
export const createSocialsManager = (socials: Socials.Links) => {
	const manager = new SocialsManager(socials ?? []);

	return new Proxy(manager, {
		get(target, prop) {
			if (prop in target) {
				return typeof target[prop] === "function" ? target[prop].bind(target) : target[prop];
			}
			if (target.getPlatforms().includes(prop as Socials.LinkKey)) {
				return target.getPlatform(prop as Socials.LinkKey) as Socials.Link;
			}
			return target.get();
		},
	}) as SocialsManager & Record<Socials.LinkKey, Socials.Link> & ReturnType<SocialsManager["get"]>;
};

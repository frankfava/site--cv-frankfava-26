import slugify from "limax";

import { SITE } from "site:config";

import { trim } from "@/utils";

const BASE_PATHNAME = SITE.base || "/";

/** eg. for current path - trimSlash(new URL(Astro.url).pathname) */
export const trimSlash = (s: string) => trim(trim(s, "/"));
export const getCurrentPath = (url: URL | string): string => `/${trimSlash(typeof url === "string" ? new URL(url).pathname : url.pathname)}`;

/** */
const createPath = (...params: string[]) => {
	const paths = params
		.map((el) => trimSlash(el))
		.filter((el) => !!el)
		.join("/");
	return "/" + paths + (SITE.trailingSlash && paths ? "/" : "");
};

/**  */
export const makeUrlSafe = (text = "") =>
	trimSlash(text)
		.split("/")
		.map((slug) => slugify(slug))
		.join("/");

/** */
export const getCanonical = (path = "", options: { removeProtocol?: boolean } = {}): string | URL => {
	const { removeProtocol = false } = options;
	const out = SITE.getCanonical(path);
	let url: string | URL = out;
	if (removeProtocol) {
		url = (out instanceof URL ? out.toString() : out).replace(/(^\w+:|^)\/\//, "");
	}
	return url;
};

/** */
export const getPermalink = (slug: string = "", options: { type?: string; removeProtocol?: boolean } = {}): string => {
	let permalink: string;
	const { type = "page", removeProtocol = true } = options;

	if (slug.startsWith("https://") || slug.startsWith("http://") || slug.startsWith("://") || slug.startsWith("#") || slug.startsWith("javascript:")) {
		return slug;
	}

	switch (type) {
		case "home":
			permalink = getHomePermalink();
			break;
		case "asset":
			permalink = getAsset(slug);
			break;
		case "page":
		default:
			permalink = createPath(slug);
			break;
	}

	const out = definitivePermalink(permalink);

	return removeProtocol ? out.replace(/(^\w+:|^)\/\//, "") : out;
};

/** */
export const getHomePermalink = (): string => {
	return getCanonical("/") as string;
};

/** */
export const getAsset = (path: string): string =>
	"/" +
	[BASE_PATHNAME, path]
		.map((el) => trimSlash(el))
		.filter((el) => !!el)
		.join("/");

/** */
const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

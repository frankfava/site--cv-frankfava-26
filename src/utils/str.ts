import { I18N } from "site:config";

import limax from "limax";

export const slugify = limax;

export const toKebabCase = (value = "") =>
	value
		.trim()
		.replace(/([a-z\d])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.replace(/[^a-zA-Z0-9-]/g, "")
		.toLowerCase();

export const toSnakeCase = (value = "") =>
	value
		.trim()
		.replace(/([a-z\d])([A-Z])/g, "$1_$2")
		.replace(/[\s-]+/g, "_")
		.replace(/[^a-zA-Z0-9_]/g, "")
		.toLowerCase();

export function readingTime(html: string) {
	const textOnly = html.replace(/<[^>]+>/g, "");
	const wordCount = textOnly.split(/\s+/).length;
	const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
	return `${readingTimeMinutes} min read`;
}

export const trim = (str = "", ch?: string) => {
	let start = 0,
		end = str.length || 0;
	while (start < end && str[start] === ch) ++start;
	while (end > start && str[end - 1] === ch) --end;
	return start > 0 || end < str.length ? str.substring(start, end) : str;
};



export const pluralize = (n: number, label: string) => `${n} ${label}${n === 1 ? "" : "s"}`;
export const truncate = (str: string = "", length: number = 200, suffix: string = "...") => {
	return str.length > length ? `${str.substring(0, length)}${suffix}` : str;
};

export const truncateByWords = (str: string = "", words: number = 40, suffix: string = "...") => {
	const wordsArr: string[] = str.split(" ");
	return wordsArr.length > words ? `${wordsArr.slice(0, words).join(" ")}${suffix}` : str;
};

export const arrayUnique = <T>(array: T[]): T[] => array.filter((value: T, index: number, self: T[]) => self.indexOf(value) === index);

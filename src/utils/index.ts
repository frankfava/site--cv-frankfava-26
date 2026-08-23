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

export const truncate = (str: string = "", length: number = 200, suffix: string = "...") => {
	return str.length > length ? `${str.substring(0, length)}${suffix}` : str;
};

export const truncateByWords = (str: string = "", words: number = 40, suffix: string = "...") => {
	const wordsArr: string[] = str.split(" ");
	return wordsArr.length > words ? `${wordsArr.slice(0, words).join(" ")}${suffix}` : str;
};

export const arrayUnique = <T>(array: T[]): T[] => array.filter((value: T, index: number, self: T[]) => self.indexOf(value) === index);

/** DATE Formatter */
export const dateFormatter = () => {
	const defaultDateTimeFormatOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	let formatterOptions: Intl.DateTimeFormatOptions = { ...defaultDateTimeFormatOptions };

	const formatter = (date: Date | string | number) => {
		const dateToFormat = new Date(date);
		return new Intl.DateTimeFormat(I18N?.language ?? "en-US", formatterOptions).format(dateToFormat);
	};

	formatter.options = (newOptions: Intl.DateTimeFormatOptions) => {
		formatterOptions = { ...formatterOptions, ...newOptions };
		return formatter;
	};

	formatter.reset = () => {
		formatterOptions = defaultDateTimeFormatOptions;
		return formatter;
	};

	formatter.monthAndYear = () => {
		formatterOptions = { year: "numeric", month: "short" };
		return formatter;
	};

	return formatter;
};

export const monthsToYears = (month: number) => {
	var y = Math.floor(month / 12);
	var mm = month % 12;
	var ym = [y >= 1 ? y + " Year" + (y == 1 ? "" : "s") : "", mm > 0 ? mm + " Month" + (mm == 1 ? "" : "s") : ""];
	return ym.filter(Boolean).join(" ");
};

export const rangeToMonths = (startDate: Date, endDate: Date) => {
	return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
};

const ISO_DURATION_RE = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

const pluralize = (n: number, label: string) => `${n} ${label}${n === 1 ? "" : "s"}`;

// Accepts either a number of months (back-compat) or an ISO 8601 duration
// string (e.g. "P2W", "P10D", "P1M2W", "PT8H", "P1DT4H").
export const formatDuration = (input: number | string): string => {
	if (typeof input === "number") return monthsToYears(input);
	const m = ISO_DURATION_RE.exec(input);
	if (!m) return "";
	const [y, mo, w, d, h, mi, s] = [m[1], m[2], m[3], m[4], m[5], m[6], m[7]].map((v) => (v ? Number(v) : 0));
	const parts: string[] = [];
	if (y) parts.push(pluralize(y, "Year"));
	if (mo) parts.push(pluralize(mo, "Month"));
	if (w) parts.push(pluralize(w, "Week"));
	if (d) parts.push(pluralize(d, "Day"));
	if (h) parts.push(pluralize(h, "Hour"));
	if (mi) parts.push(pluralize(mi, "Minute"));
	if (s) parts.push(pluralize(s, "Second"));
	return parts.join(" ");
};

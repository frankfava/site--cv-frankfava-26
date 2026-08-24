import { I18N } from "site:config";
import { pluralize } from "./str";

export function readingTime(html: string) {
	const textOnly = html.replace(/<[^>]+>/g, "");
	const wordCount = textOnly.split(/\s+/).length;
	const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
	return `${readingTimeMinutes} min read`;
}

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

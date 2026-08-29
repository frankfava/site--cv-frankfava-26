/** Which year the timeline is reading, shared by the chart and its read-out. */
import { CAREER_YEARS, CAREER_DEFAULT_INDEX } from "@/data/career";
import { CHART, chartX, chartY } from "./chart";

export const CAREER_STORE = "career";

/** Narrower than this and the y-axis gutter cannot hold its numbers. */
const AXIS_GUTTER = 26;

/** Room a year label needs before the one beside it may also show. */
const LABEL_ROOM = 31;

export function careerStore() {
	return {
		years: CAREER_YEARS,
		index: CAREER_DEFAULT_INDEX,
		/** Rendered width of the chart. Label sizing keys off it. */
		width: CHART.W,

		setIndex(value) {
			this.index = Math.max(0, Math.min(this.years.length - 1, Number(value)));
		},

		get year() {
			return this.years[this.index];
		},

		get scale() {
			return Math.max(this.width / CHART.W, 0.1);
		},

		/** Text inside a viewBox is sized in user units, so it has to grow as the chart shrinks. */
		get labelSize() {
			return Math.round(11 / this.scale);
		},

		get showAxisValues() {
			return CHART.LEFT * this.scale >= AXIS_GUTTER;
		},

		get cursorX() {
			return chartX(this.index, this.years.length);
		},

		dotY(key) {
			return chartY(this.year[key]);
		},

		barWidth(key) {
			return `${this.year[key]}%`;
		},

		showYear(index, previous) {
			if (previous < 0) return true;
			return (chartX(index, this.years.length) - chartX(previous, this.years.length)) * this.scale >= LABEL_ROOM;
		},
	};
}

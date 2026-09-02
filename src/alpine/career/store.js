/** Which year the timeline is reading, shared by the chart and its read-out. */
import { CAREER_SERIES } from "@/data/careerSeries";
import { openingIndex, yearAverage } from "@/lib/career";
import { CHART, chartX, chartY } from "./chart";

export const CAREER_STORE = "career";

/** Narrower than this and the y-axis gutter cannot hold its numbers. */
const AXIS_GUTTER = 26;

/** Room a year label needs before the one beside it may also show. */
const LABEL_ROOM = 31;

export function careerStore() {
	return {
		years: [],
		index: 0,
		/** Rendered width of the chart. Label sizing keys off it. */
		width: CHART.W,

		/** Handed the years on `data-years`, since the collection cannot be read from the client. */
		load(years) {
			this.years = years;
			this.index = openingIndex(years);
		},

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
			return chartY(this.year.axes[key]);
		},

		barWidth(key) {
			return `${this.year.axes[key]}%`;
		},

		get total() {
			return CAREER_SERIES.reduce((sum, series) => sum + this.year.axes[series.key], 0);
		},

		/** What the centre of the doughnut reads. */
		get average() {
			return yearAverage(CAREER_SERIES, this.year);
		},

		/** Segmented variant: this series' share of the year. */
		shareOf(key) {
			return this.total ? this.year.axes[key] / this.total : 0;
		},

		/** How far round the ring this series starts. */
		offsetOf(key) {
			let before = 0;
			for (const series of CAREER_SERIES) {
				if (series.key === key) break;
				before += this.shareOf(series.key);
			}
			return before;
		},

		showYear(index, previous) {
			if (previous < 0) return true;
			return (chartX(index, this.years.length) - chartX(previous, this.years.length)) * this.scale >= LABEL_ROOM;
		},
	};
}

/** The career timeline's Alpine components. */
import { CAREER_STORE } from "./store.js";
import { CHART } from "./chart";

/** <div x-data="careerTimeline" data-years="[...]"> — owns the measuring and the scrubbing. */
export function careerTimeline() {
	return {
		get store() {
			return this.$store[CAREER_STORE];
		},

		init() {
			this.store.load(JSON.parse(this.$el.dataset.years));
			this.measure();
			// Observing the card, not the chart: an SVG is not a reliable resize target.
			new ResizeObserver(() => this.measure()).observe(this.$el);
		},

		measure() {
			this.store.width = this.$refs.chart.getBoundingClientRect().width || CHART.W;
		},

		get year() {
			return this.store.year;
		},

		get index() {
			return this.store.index;
		},

		get labelSize() {
			return this.store.labelSize;
		},

		get showAxisValues() {
			return this.store.showAxisValues;
		},

		get cursorX() {
			return this.store.cursorX;
		},

		setIndex(event) {
			this.store.setIndex(event.target.value);
		},

		/** Scrub on hover with a mouse, or while a touch is down. */
		scrub(event) {
			if (event.type === "pointermove" && event.pointerType !== "mouse" && event.pressure === 0) return;

			const box = this.$refs.chart.getBoundingClientRect();
			const step = (CHART.W - CHART.LEFT - CHART.RIGHT) / (this.store.years.length - 1);
			this.store.setIndex(Math.round((((event.clientX - box.left) / box.width) * CHART.W - CHART.LEFT) / step));
		},
	};
}

/** <text x-data="careerYearLabel" data-index="3" data-previous="0"> */
export function careerYearLabel() {
	return {
		index: 0,
		previous: -1,

		init() {
			this.index = Number(this.$el.dataset.index);
			this.previous = Number(this.$el.dataset.previous);
		},

		get store() {
			return this.$store[CAREER_STORE];
		},

		get size() {
			return this.store.labelSize;
		},

		get show() {
			return this.store.showYear(this.index, this.previous);
		},
	};
}

/** <circle x-data="careerDot" data-series="decisions"> */
export function careerDot() {
	return {
		key: "",

		init() {
			this.key = this.$el.dataset.series;
		},

		get store() {
			return this.$store[CAREER_STORE];
		},

		get cx() {
			return this.store.cursorX;
		},

		get cy() {
			return this.store.dotY(this.key);
		},
	};
}

/** <i x-data="careerBar" data-series="decisions"> */
export function careerBar() {
	return {
		key: "",

		init() {
			this.key = this.$el.dataset.series;
		},

		get store() {
			return this.$store[CAREER_STORE];
		},

		get style() {
			return { width: this.store.barWidth(this.key) };
		},
	};
}

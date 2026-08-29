/** The career doughnut's Alpine components. */
import { CAREER_STORE } from "./store.js";
import { arcSpan } from "./chart";

/** <div x-data="careerDoughnut"> */
export function careerDoughnut() {
	return {
		get store() {
			return this.$store[CAREER_STORE];
		},

		suffix: "",

		init() {
			this.suffix = this.$el.dataset.suffix ?? "";
		},

		get year() {
			return this.store.year;
		},

		get reading() {
			return `${this.store.average}${this.suffix}`;
		},
	};
}

/** <circle x-data="careerArc" data-series="decisions" data-variant="rings" data-gap="4"> */
export function careerArc() {
	return {
		key: "",
		variant: "rings",
		gap: 0,

		init() {
			this.key = this.$el.dataset.series;
			this.variant = this.$el.dataset.variant;
			this.gap = Number(this.$el.dataset.gap ?? 0);
		},

		get store() {
			return this.$store[CAREER_STORE];
		},

		get circumference() {
			return 2 * Math.PI * Number(this.$el.getAttribute("r"));
		},

		/** Bound as style, not as attributes: only the CSS properties transition. */
		get style() {
			const { drawn, rest } = arcSpan({
				variant: this.variant,
				value: this.store.year[this.key],
				total: this.store.total,
				circumference: this.circumference,
				gap: this.gap,
			});

			return {
				strokeDasharray: `${drawn} ${rest}`,
				strokeDashoffset: this.variant === "segments" ? -this.circumference * this.store.offsetOf(this.key) : 0,
			};
		},
	};
}

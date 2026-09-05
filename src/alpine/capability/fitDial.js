/** The live reading in the index bay. The store deals in facts; this words them. */
import { CAPABILITY_STORE } from "./store.js";

/** <div x-data="fitDial"> */
export function fitDial() {
	return {
		arcLength: 0,

		init() {
			this.arcLength = this.$refs.arc.getTotalLength();
		},

		get store() {
			return this.$store[CAPABILITY_STORE];
		},

		get answered() {
			return this.store.asked > 0;
		},

		get value() {
			return this.answered ? `${this.store.pct}%` : "";
		},

		get label() {
			return this.answered ? "of what you asked for is covered" : "nothing selected yet";
		},

		get text() {
			if (!this.answered) return "Set at least one slider and this will fill in.";

			const { gaps } = this.store;
			if (!gaps.length) return "Everything you've asked for, I can evidence on this site.";

			if (gaps.length === 1) return `One thing to talk about: ${gaps[0]}.`;
			return `${gaps.length} things to talk about: ${gaps.join(", ")}.`;
		},

		get noteLead() {
			return this.store.over.length ? "Where you'd get more than you asked for:" : "Note:";
		},

		get noteBody() {
			const { over } = this.store;
			return over.length ? `${over.join(", ")}.` : "this is my own read of my evidence, and the work behind every line is on this site.";
		},

		get arcClass() {
			return `is-${this.store.verdict}`;
		},

		get arcStyle() {
			return { strokeDasharray: this.arcLength, strokeDashoffset: this.arcLength * (1 - this.store.pct / 100) };
		},

		get needleTransform() {
			return `rotate(${-90 + (this.store.pct / 100) * 180} 110 110)`;
		},
	};
}

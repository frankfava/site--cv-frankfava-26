/** What the reader asked for, shared by every part of the capability check. */
import { CAPABILITIES } from "@/data/capabilities";

export const CAPABILITY_STORE = "capability";

/** Short of where I sit by this much or less is close, not a gap. */
const TIGHT_WITHIN = 15;

/** Headroom worth calling out as more than they asked for. */
const GENEROUS_BY = 25;

/** Where the overall reading stops being covered, and stops being close. */
const COVERED_AT = 85;
const TIGHT_AT = 65;

export function capabilityStore() {
	return {
		capabilities: CAPABILITIES,
		need: Object.fromEntries(CAPABILITIES.map((c) => [c.id, c.defaultNeed])),

		find(id) {
			return this.capabilities.find((c) => c.id === id);
		},

		/** Not `valueOf`: that name is taken and ignores its argument. */
		needOf(id) {
			return Number(this.need[id]);
		},

		setNeed(id, value) {
			this.need[id] = Number(value);
		},

		reset() {
			this.capabilities.forEach((c) => (this.need[c.id] = c.defaultNeed));
		},

		verdictOf(id) {
			const need = this.needOf(id);
			if (need === 0) return "none";

			const headroom = this.find(id).sits - need;
			if (headroom >= 0) return "covered";
			return -headroom <= TIGHT_WITHIN ? "tight" : "gap";
		},

		get asked() {
			return this.capabilities.reduce((sum, c) => sum + this.needOf(c.id), 0);
		},

		get met() {
			return this.capabilities.reduce((sum, c) => sum + Math.min(this.needOf(c.id), c.sits), 0);
		},

		get pct() {
			return this.asked ? Math.round((this.met / this.asked) * 100) : 0;
		},

		get verdict() {
			if (!this.asked) return "none";
			if (this.pct >= COVERED_AT) return "covered";
			return this.pct >= TIGHT_AT ? "tight" : "gap";
		},

		get gaps() {
			return this.capabilities.filter((c) => this.verdictOf(c.id) === "gap").map((c) => c.label);
		},

		get over() {
			return this.capabilities.filter((c) => c.sits - this.needOf(c.id) >= GENEROUS_BY).map((c) => c.label);
		},
	};
}

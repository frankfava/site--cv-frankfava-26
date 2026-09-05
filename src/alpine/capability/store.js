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

		/** One lever for a role that wants everything at about the same level. */
		unison: false,

		find(id) {
			return this.capabilities.find((c) => c.id === id);
		},

		/** Not `valueOf`: that name is taken and ignores its argument. */
		needOf(id) {
			return Number(this.need[id]);
		},

		toggleUnison() {
			this.unison = !this.unison;
		},

		setNeed(id, value) {
			const next = Number(value);
			if (this.unison) return this.capabilities.forEach((c) => (this.need[c.id] = next));
			this.need[id] = next;
		},

		reset() {
			this.capabilities.forEach((c) => (this.need[c.id] = c.defaultNeed));
		},

		verdictOf(id) {
			const need = this.needOf(id);
			if (need === 0) return "none";

			const headroom = this.find(id).sits - need;
			if (headroom >= GENEROUS_BY) return "generous";
			if (headroom >= 0) return "covered";
			return -headroom <= TIGHT_WITHIN ? "tight" : "gap";
		},

		get asked() {
			return this.capabilities.reduce((sum, c) => sum + this.needOf(c.id), 0);
		},

		get pct() {
			const axes = this.capabilities.filter((c) => this.needOf(c.id) > 0);
			if (!axes.length) return 0;

			const covered = axes.reduce((sum, c) => sum + Math.min(c.sits, this.needOf(c.id)) / this.needOf(c.id), 0);
			return Math.round((covered / axes.length) * 100);
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
			return this.capabilities.filter((c) => this.verdictOf(c.id) === "generous").map((c) => c.label);
		},
	};
}

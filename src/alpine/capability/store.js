/** What the reader asked for, shared by every part of the capability check. */
import { CAPABILITIES } from "@/data/capabilities";

export const CAPABILITY_STORE = "capability";

/** Short of where I sit by this much or less is close, not a gap. */
const TIGHT_WITHIN = 15;

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
	};
}

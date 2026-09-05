/** The capability check's Alpine components. */
import { CAPABILITY_STORE } from "./store.js";
import { radarPath } from "./radar";

const VERDICT_TEXT = {
	generous: "More than you need here.",
	covered: "Covered.",
	tight: "Close. I'd be learning on the job.",
	gap: "This is a real gap. Worth asking me about.",
	none: "Not needed here.",
};

/** <div x-data="capabilityPanel"> */
export function capabilityPanel() {
	return {
		get store() {
			return this.$store[CAPABILITY_STORE];
		},

		reset() {
			this.store.reset();
		},

		get unison() {
			return this.store.unison;
		},

		toggleUnison() {
			this.store.toggleUnison();
		},

		/** The only shape that moves; mine is drawn at build time. */
		get yoursShape() {
			return radarPath(this.store.capabilities.map((c) => this.store.needOf(c.id)));
		},
	};
}

/** <div x-data="capabilityRow" data-capability="cust">, one row per capability
 *  because the CSP build cannot evaluate `needOf('cust')`. */
export function capabilityRow() {
	return {
		id: "",

		init() {
			this.id = this.$el.dataset.capability;
		},

		get store() {
			return this.$store[CAPABILITY_STORE];
		},

		get need() {
			return this.store.needOf(this.id);
		},

		get verdictClass() {
			return `is-${this.store.verdictOf(this.id)}`;
		},

		get verdictText() {
			return VERDICT_TEXT[this.store.verdictOf(this.id)];
		},

		setNeed(event) {
			this.store.setNeed(this.id, event.target.value);
		},
	};
}

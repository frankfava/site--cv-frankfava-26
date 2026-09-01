/**
 * One selected key at a time, shared between options and the panels they reveal.
 *
 * Options and panels are separate components, so the selection lives in a store
 * rather than a parent scope. Each reads its own key off `data-key` and its
 * group off the nearest `[data-picker]`, because the CSP build cannot pass an
 * argument from a template.
 */
import { PICKER_STORE } from "./store.js";

const groupOf = (el) => el.closest("[data-picker]")?.dataset.picker;

/** <div x-data="picker" data-picker="scenarios" data-key="ops"> */
export function picker() {
	return {
		init() {
			this.$store[PICKER_STORE].start(this.$el.dataset.picker, this.$el.dataset.key);
		},
	};
}

/** <button x-data="pickerItem" data-key="ops"> and the panel it reveals. */
export function pickerItem() {
	return {
		group: "",
		key: "",

		init() {
			this.group = groupOf(this.$el);
			this.key = this.$el.dataset.key;
		},

		select() {
			this.$store[PICKER_STORE].select(this.group, this.key);
		},

		get shown() {
			return this.$store[PICKER_STORE].isSelected(this.group, this.key);
		},

		get pressed() {
			return this.shown ? "true" : "false";
		},

		/** A string, not an object: the CSP build cannot evaluate a class map. */
		get fadeClass() {
			return this.$store[PICKER_STORE].isFading(this.group, this.key) ? "is-fading" : "";
		},
	};
}

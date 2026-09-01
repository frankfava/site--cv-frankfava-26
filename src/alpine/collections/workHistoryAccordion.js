/**
 * One collapsible role in the work-history timeline.
 *
 * Rows open independently, so each carries its own scope and there is no parent
 * or store to share. The opening state arrives on `data-start-open`, because the
 * CSP build cannot pass an argument from a template.
 */
export function workHistoryAccordion() {
	return {
		open: false,

		init() {
			this.open = this.$el.dataset.startOpen === "true";
		},

		toggle() {
			this.open = !this.open;
		},

		/** A string, not an object: the CSP build cannot evaluate a class map. */
		get caretClass() {
			return this.open ? "" : "rotate-180";
		},
	};
}

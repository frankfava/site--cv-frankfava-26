/** Which option each picker has selected, keyed by group so a page can hold several. */
export const PICKER_STORE = "picker";

export function pickerStore() {
	return {
		selected: {},
		faded: {},

		/** The opening choice. Kept apart from `select` so it arrives unanimated. */
		start(group, key) {
			this.selected[group] = key;
		},

		select(group, key) {
			this.selected[group] = key;
			this.faded[group] = key;
		},

		isSelected(group, key) {
			return this.selected[group] === key;
		},

		isFading(group, key) {
			return this.faded[group] === key;
		},
	};
}

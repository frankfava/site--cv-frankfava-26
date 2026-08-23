/**
 * Light and dark theme toggle.
 */
const KEY = "darkColorScheme";

export function themeToggle() {
	return {
		isOpen: false,
		activeTheme: "system",

		init() {
			this.activeTheme = this.$el.dataset.theme || "system";
		},

		toggle() {
			this.isOpen = !this.isOpen;
		},

		close() {
			this.isOpen = false;
		},

		isActive(key) {
			return this.activeTheme === key;
		},

		select(key) {
			this.activeTheme = key;
			this.isOpen = false;
			window.colorSchemeSwitcher.setTheme(key);
		},
	};
}
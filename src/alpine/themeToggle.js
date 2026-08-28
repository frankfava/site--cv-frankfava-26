/**
 * Colour mode control, in two shapes.
 *
 * `ToggleTheme.astro` uses it as a three-way dropdown (light, dark, system):
 * `toggleOpen()` opens the menu, `isActive(key)` marks the current choice and
 * `select(key)` commits one.
 *
 * The indexed header uses it as a single button: `toggle()` flips straight
 * between light and dark, with `isDark` to draw the icon and `label` to say
 * where the next click goes.
 *
 * `window.colorSchemeSwitcher` owns persistence and the `.dark` class. Nothing
 * here duplicates that; every change goes through it and `sync()` re-reads the
 * result, so the two can never disagree.
 */
export function themeToggle() {
	return {
		isOpen: false,
		activeTheme: "system",
		isDark: false,
		options: ["light", "dark", "system"],

		init() {
			this.activeTheme = this.$el.dataset.theme || "system";
			this.options = (this.$el.dataset.options || "light,dark,system").split(",");
			this.sync();
			// A visitor on `system` follows the OS, which can change while the page
			// is open. The switcher already listens; this keeps the icon in step.
			window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => this.sync());
		},

		sync() {
			this.isDark = document.documentElement.classList.contains("dark");
		},

		/** Dropdown shape. */
		toggleOpen() {
			this.isOpen = !this.isOpen;
		},

		close() {
			this.isOpen = false;
		},

		isActive(key) {
			// A control that does not offer the stored choice cannot mark it, so it
			// falls back to whatever that choice currently resolves to. The switcher
			// already reads the media query; asking it keeps one answer.
			if (this.options.includes(this.activeTheme)) return this.activeTheme === key;
			return window.colorSchemeSwitcher.lightOrDark() === key;
		},

		select(key) {
			this.activeTheme = key;
			this.isOpen = false;
			window.colorSchemeSwitcher.setTheme(key);
			this.sync();
		},

		/** Single-button shape. */
		get label() {
			return this.isDark ? "Switch to light mode" : "Switch to dark mode";
		},

		toggle() {
			this.select(this.isDark ? "light" : "dark");
		},
	};
}

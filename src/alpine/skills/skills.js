/**
 * The components the skills list is built from. Each reads its own keys off
 * `data-` attributes, because the CSP build cannot pass an argument from a
 * template.
 */
import { SKILLS_STORE } from "./store.js";

const store = (component) => component.$store[SKILLS_STORE];

/** <div x-data="skillList" data-skills="[...]" …> */
export function skillList() {
	return {
		init() {
			store(this).load({
				skills: JSON.parse(this.$el.dataset.skills),
				proficiencies: JSON.parse(this.$el.dataset.proficiencies),
				relevanceOptions: JSON.parse(this.$el.dataset.relevance),
				filters: JSON.parse(this.$el.dataset.filters),
				filterToggles: JSON.parse(this.$el.dataset.toggles),
			});
		},

		get searchQuery() {
			return store(this).searchQuery;
		},
		set searchQuery(value) {
			store(this).searchQuery = value;
		},

		get isFiltered() {
			return store(this).isFiltered;
		},
		get isFullscreen() {
			return store(this).isFullscreen;
		},
		get showCvFilter() {
			return store(this).showCvFilter;
		},
		get totalSkillsLabel() {
			return store(this).totalSkillsLabel;
		},
		get filteredSkillsLabel() {
			return store(this).filteredSkillsLabel;
		},
		get onlyForThisCV() {
			return store(this).filters.onlyForThisCV;
		},

		get mobileFiltersOpen() {
			return store(this).mobileFiltersOpen;
		},
		toggleMobileFilters() {
			store(this).mobileFiltersOpen = !store(this).mobileFiltersOpen;
		},
		get mobileFiltersLabel() {
			return this.mobileFiltersOpen ? "Hide filters" : "Show filters";
		},

		/** Strings, not objects: the CSP build cannot evaluate a class map. */
		get fullscreenClass() {
			return this.isFullscreen ? "fixed inset-0 z-60 m-0! overflow-y-auto bg-ground p-4 md:p-6" : "";
		},
		get stickyClass() {
			return this.isFullscreen ? "xl:top-2" : "xl:top-[100px]";
		},
		get panelsClass() {
			return this.mobileFiltersOpen ? "" : "hidden xl:block";
		},
		get scrollClass() {
			return this.isFullscreen ? "" : "lg:max-h-[90vh] lg:overflow-y-auto";
		},
		get fullscreenLabel() {
			return this.isFullscreen ? "Exit fullscreen" : "Make fullscreen";
		},

		openFullscreen() {
			store(this).openFullscreen();
		},
		closeFullscreen() {
			store(this).closeFullscreen();
		},
		handleEscape() {
			store(this).handleEscape();
		},
		clearFilters() {
			store(this).clearFilters();
		},
		toggleCv() {
			store(this).toggleCv();
		},
	};
}

/** <div x-data="skillCard" data-id="…"> */
export function skillCard() {
	return {
		id: "",
		init() {
			this.id = this.$el.dataset.id;
		},
		get shown() {
			return store(this).filteredSkillIds.includes(this.id);
		},
	};
}

/** A checkbox, chip or tag switching one facet value on and off. */
export function skillFacet() {
	return {
		facet: "",
		value: "",
		init() {
			this.facet = this.$el.dataset.facet;
			this.value = this.$el.dataset.value;
		},
		toggle() {
			store(this).toggleFilter(this.facet, this.value);
		},
		get active() {
			return store(this).isActive(this.facet, this.value);
		},
		get tagClass() {
			return this.active ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-sunk text-ink-3";
		},
		get count() {
			return store(this).relevanceCount(this.value);
		},
		get countLabel() {
			return "(" + this.count + ")";
		},
	};
}

/** One collapsible filter panel in the sidebar. */
export function skillPanel() {
	return {
		panel: "",
		init() {
			this.panel = this.$el.dataset.panel;
		},
		toggle() {
			store(this).togglePanel(this.panel);
		},
		get open() {
			return store(this).isPanelOpen(this.panel);
		},
		get expanded() {
			return this.open ? "true" : "false";
		},
		get caretClass() {
			return this.open ? "" : "rotate-180";
		},
		get count() {
			return store(this).countFor(this.panel);
		},
		get hasCount() {
			return this.count > 0;
		},
		get countLabel() {
			return "(" + this.count + ")";
		},
	};
}

/**
 * The components the project list is built from. Each reads its own key off a
 * `data-` attribute, because the CSP build cannot pass an argument from a
 * template.
 */
import { PROJECTS_STORE } from "./store.js";

/** <div x-data="projectList" data-projects="[...]" data-skills="[...]"> */
export function projectList() {
	return {
		init() {
			this.$store[PROJECTS_STORE].load({
				projects: JSON.parse(this.$el.dataset.projects),
				skills: JSON.parse(this.$el.dataset.skills),
			});
		},

		get searchQuery() {
			return this.$store[PROJECTS_STORE].searchQuery;
		},
		set searchQuery(value) {
			this.$store[PROJECTS_STORE].searchQuery = value;
		},
		get skillQuery() {
			return this.$store[PROJECTS_STORE].skillQuery;
		},
		set skillQuery(value) {
			this.$store[PROJECTS_STORE].skillQuery = value;
		},

		get isFiltered() {
			return this.$store[PROJECTS_STORE].isFiltered;
		},
		get isFullscreen() {
			return this.$store[PROJECTS_STORE].isFullscreen;
		},
		get totalProjectsLabel() {
			return this.$store[PROJECTS_STORE].totalProjectsLabel;
		},
		get filteredProjectsLabel() {
			return this.$store[PROJECTS_STORE].filteredProjectsLabel;
		},
		get skillsCountLabel() {
			return this.$store[PROJECTS_STORE].skillsCountLabel;
		},
		get hasSkillFilters() {
			return !!this.$store[PROJECTS_STORE].filters.skills.length;
		},

		/** Strings, not objects: the CSP build cannot evaluate a class map. */
		get fullscreenClass() {
			return this.isFullscreen ? "fixed inset-0 z-60 m-0! overflow-y-auto bg-ground p-4 md:p-6" : "";
		},
		get stickyClass() {
			return this.isFullscreen ? "xl:top-2" : "xl:top-[100px]";
		},
		get fullscreenLabel() {
			return this.isFullscreen ? "Exit fullscreen" : "Make fullscreen";
		},

		openFullscreen() {
			this.$store[PROJECTS_STORE].openFullscreen();
		},
		closeFullscreen() {
			this.$store[PROJECTS_STORE].closeFullscreen();
		},
		handleEscape() {
			this.$store[PROJECTS_STORE].handleEscape();
		},
		clearFilters() {
			this.$store[PROJECTS_STORE].clearFilters();
		},
	};
}

/** <div x-data="projectRow" data-id="..."> */
export function projectRow() {
	return {
		id: "",
		init() {
			this.id = this.$el.dataset.id;
		},
		get shown() {
			return this.$store[PROJECTS_STORE].filteredProjectIds.includes(this.id);
		},
	};
}

/** A skill chip, in the sidebar list or on a project row. */
export function projectSkill() {
	return {
		id: "",
		label: "",
		init() {
			this.id = this.$el.dataset.id;
			this.label = (this.$el.dataset.label ?? "").toLowerCase();
		},
		toggle() {
			this.$store[PROJECTS_STORE].toggleFilter("skills", this.id);
		},
		get active() {
			return this.$store[PROJECTS_STORE].isSkillActive(this.id);
		},
		get shown() {
			return this.$store[PROJECTS_STORE].isOptionShown(this.label);
		},
		get chipClass() {
			return this.active ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-sunk text-ink-3";
		},
	};
}

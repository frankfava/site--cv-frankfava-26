/**
 * Search and four-axis filtering for the skills list.
 *
 * The state lives in a store because the cards, the chips and the filter panels
 * are separate components and a child cannot reach its parent's scope. The list
 * arrives on `data-skills`, so the getters below stay the ones this component
 * has always had.
 */
import { createFilterMixin } from "../filterMixin.js";

export const SKILLS_STORE = "skills";

export function skillsStore() {
	const filterMixin = createFilterMixin({
		sectionId: "skill-display",
		// The CV toggle is a shortcut into a fixed filter set, so any other
		// choice has to release it or the two disagree about what is showing.
		beforeToggle() {
			if (this.filters.onlyForThisCV) this.filters.onlyForThisCV = false;
		},
		clearMap: {
			searchQuery: "",
			filters() {
				return this.defaultFilters();
			},
		},
	});

	return {
		skills: [],
		proficiencies: [],
		relevanceOptions: [],
		allowedFilters: [],
		filterToggles: {},
		isFullscreen: false,
		mobileFiltersOpen: false,
		searchQuery: "",
		filters: { proficiency: [], keywords: [], relevance: [], onlyForThisCV: false },

		load({ skills, proficiencies, filters, filterToggles, relevanceOptions }) {
			Object.assign(this, { skills, proficiencies, relevanceOptions, allowedFilters: filters, filterToggles: { ...filterToggles } });
			this.filters = this.defaultFilters();
		},

		defaultFilters() {
			return {
				proficiency: this.proficiencies.map((p) => p.key),
				keywords: [],
				relevance: this.relevanceOptions.slice(0, 1).map((r) => r.key),
				onlyForThisCV: false,
			};
		},

		openFullscreen() {
			this.isFullscreen = true;
			this.syncBodyOverflow();
		},
		closeFullscreen() {
			this.isFullscreen = false;
			this.syncBodyOverflow();
		},
		handleEscape() {
			if (this.isFullscreen) this.closeFullscreen();
		},
		syncBodyOverflow() {
			document.body.style.overflow = this.isFullscreen ? "hidden" : "";
		},

		get isFiltered() {
			return JSON.stringify(this.filters) !== JSON.stringify(this.defaultFilters());
		},
		get totalSkillsLabel() {
			const count = this.skills.length;
			return count + " Skill" + (count === 1 ? "" : "s");
		},
		get filteredSkillsLabel() {
			return "(" + this.filteredSkills.length + " showing)";
		},
		get showCvFilter() {
			return this.skills.some((s) => s.usedForCv) && this.allowedFilters.includes("cv");
		},

		countFor(facet) {
			return facet === "cv" ? 0 : (this.filters[facet] ?? []).length;
		},
		relevanceCount(key) {
			return this.skills.filter((skill) => (skill.relevance ?? []).some((r) => r.key === key)).length;
		},

		get filteredSkills() {
			if (this.filters.onlyForThisCV && this.showCvFilter) return this.skills.filter((s) => s.usedForCv);

			const query = this.searchQuery.toLowerCase();
			return this.skills.filter((skill) => {
				const tags = (skill.relevance ?? []).map((r) => r.key);
				// Relevance is an OR-filter, bypassed while a search is running so
				// any skill remains findable by name.
				const matchesRelevance = !this.filters.relevance.length || tags.some((t) => this.filters.relevance.includes(t));
				if (!query && !matchesRelevance) return false;

				const matchesProficiency = !this.filters.proficiency.length || this.filters.proficiency.includes(skill.proficiency.key);
				const matchesKeywords = !this.filters.keywords.length || skill.keywords.some((keyword) => this.filters.keywords.includes(keyword));
				const matchesQuery = !query || skill.label.toLowerCase().includes(query) || skill.keywords.some((keyword) => keyword.toLowerCase().includes(query));
				return matchesQuery && matchesProficiency && matchesKeywords;
			});
		},
		get filteredSkillIds() {
			return this.filteredSkills.map((skill) => skill.id);
		},

		isActive(facet, value) {
			return (this.filters[facet] ?? []).includes(value);
		},
		togglePanel(panel) {
			if (panel in this.filterToggles) this.filterToggles[panel] = !this.filterToggles[panel];
		},
		isPanelOpen(panel) {
			return !!this.filterToggles[panel];
		},

		limitToSkillsUsedForThisCV(flag) {
			this.searchQuery = "";
			this.filters.proficiency = [];
			this.filters.keywords = [];
			this.filters.relevance = ["active_stack"];
			this.filters.onlyForThisCV = !!flag;
		},
		toggleCv() {
			this.limitToSkillsUsedForThisCV(!this.filters.onlyForThisCV);
		},

		toggleFilter: filterMixin.toggleFilter,
		clearFilters: filterMixin.clearFilters,
	};
}

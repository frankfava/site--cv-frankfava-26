import { createFilterMixin } from "./filterMixin.js";

export function skillsComponent({ skills, proficiencies, filters, filterToggles = {}, relevanceOptions = [] }) {
	const defaultFilters = () => ({
		proficiency: proficiencies.map((p) => p.key),
		keywords: [],
		relevance: relevanceOptions.slice(0, 1).map((r) => r.key),
		onlyForThisCV: false,
	});

	const filterMixin = createFilterMixin({
		sectionId: "skill-display",
		beforeToggle() {
			if (this.filters.onlyForThisCV) {
				this.filters.onlyForThisCV = false;
			}
		},
		clearMap: {
			searchQuery: "",
			filters: defaultFilters,
		},
	});

	return {
		skills: [...skills],
		proficiencies: [...proficiencies],
		relevanceOptions: [...relevanceOptions],
		allowedFilters: [...filters],
		isFullscreen: false,
		mobileFiltersOpen: false,
		searchQuery: "",
		filters: defaultFilters(),
		filterToggles: { ...filterToggles },
		showNotes: false,
		init() {},
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
			return JSON.stringify(this.filters) !== JSON.stringify(defaultFilters());
		},
		get totalSkillsLabel() {
			const count = this.skills.length;
			return count + " Skill" + (count === 1 ? "" : "s");
		},
		get filteredSkillsLabel() {
			return "(" + this.filteredSkills.length + " showing)";
		},
		get proficiencyCountLabel() {
			return "(" + this.filters.proficiency.length + ")";
		},
		get keywordCountLabel() {
			return "(" + this.filters.keywords.length + ")";
		},
		get relevanceCountLabel() {
			return "(" + this.filters.relevance.length + ")";
		},
		get relevanceCounts() {
			return {
				active_stack: this.skills.filter((s) => (s.relevance ?? []).map((r) => r.key).includes("active_stack")).length,
				shipped: this.skills.filter((s) => (s.relevance ?? []).map((r) => r.key).includes("shipped")).length,
				peripheral: this.skills.filter((s) => (s.relevance ?? []).map((r) => r.key).includes("peripheral")).length,
			};
		},
		get proficiencyOptions() {
			const usedProficiencies = [...new Set(this.skills.map((skill) => skill.proficiency.key))];
			return this.proficiencies.filter((p) => usedProficiencies.includes(p.key));
		},
		get keywordOptions() {
			return [...new Set(this.skills.flatMap((skill) => skill.keywords))].sort((a, b) => a.localeCompare(b));
		},
		get showCvFilter() {
			return this.skills.some((s) => s.usedForCv) && this.allowedFilters.includes("cv");
		},
		get filteredSkills() {
			let skills = this.skills;

			if (this.filters.onlyForThisCV && this.showCvFilter) {
				return skills.filter((s) => s.usedForCv);
			}

			const query = this.searchQuery.toLowerCase();
			const hasNameSearch = !!query;
			return skills.filter((skill) => {
				const tags = (skill.relevance ?? []).map((r) => r.key);
				// Relevance OR-filter: skill must have at least one selected tag.
				// Bypassed by an active name-search so users can find any skill.
				const matchesRelevance = !this.filters.relevance.length || tags.some((t) => this.filters.relevance.includes(t));
				if (!hasNameSearch && !matchesRelevance) return false;

				const matchesProficiency = this.filters.proficiency.length === 0 || this.filters.proficiency.includes(skill.proficiency.key);
				const matchesKeywords = this.filters.keywords.length === 0 || skill.keywords.some((keyword) => this.filters.keywords.includes(keyword));
				let matchesQuery = true;
				if (query) {
					const inLabel = skill.label.toLowerCase().includes(query);
					const inKeywords = skill.keywords.some((keyword) => keyword.toLowerCase().includes(query));
					matchesQuery = inLabel || inKeywords;
				}
				return matchesQuery && matchesProficiency && matchesKeywords;
			});
		},
		get filteredSkillIds() {
			return this.filteredSkills.map((skill) => skill.id);
		},
		shouldShow(skillId) {
			return this.filteredSkillIds.includes(skillId);
		},
		toggleFilterPanel(panel) {
			if (!(panel in this.filterToggles)) return;
			this.filterToggles[panel] = !this.filterToggles[panel];
		},
		toggleFilter: filterMixin.toggleFilter,
		clearFilters: filterMixin.clearFilters,
		limitToSkillsUsedForThisCV(flag) {
			this.searchQuery = "";
			this.filters.proficiency = [];
			this.filters.keywords = [];
			this.filters.relevance = ["active_stack"];
			this.filters.onlyForThisCV = !!flag;
		},
	};
}

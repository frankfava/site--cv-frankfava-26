/**
 * Search and skill-filtering for the project list.
 *
 * The state lives in a store because the rows and the filter chips are separate
 * components and a child cannot reach its parent's scope. The list itself is
 * handed over on `data-projects`, so the getters below stay the ones this
 * component has always had.
 */
import { createFilterMixin } from "../filterMixin.js";

export const PROJECTS_STORE = "projects";

export function projectsStore() {
	const filterMixin = createFilterMixin({
		sectionId: "project-display",
		clearMap: {
			searchQuery: "",
			skillQuery: "",
			filters: () => ({ skills: [] }),
		},
	});

	return {
		projects: [],
		skills: [],
		isFullscreen: false,
		searchQuery: "",
		skillQuery: "",
		filters: { skills: [] },

		load({ projects, skills }) {
			const usedSkills = new Set(projects.flatMap((project) => project.skills.map((skill) => skill.id)));
			this.projects = projects;
			this.skills = skills.filter((skill) => usedSkills.has(skill.id));
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
			return !!this.filters.skills.length || !!this.searchQuery;
		},
		get totalProjectsLabel() {
			const count = this.projects.length;
			return count + " Project" + (count === 1 ? "" : "s");
		},
		get filteredProjectsLabel() {
			return "(" + this.filteredProjects.length + " showing)";
		},
		get skillsCountLabel() {
			return "(" + this.filters.skills.length + ")";
		},
		get skillOptions() {
			const query = this.skillQuery.toLowerCase();
			return this.skills.filter((skill) => skill.label.toLowerCase().includes(query));
		},
		get filteredProjects() {
			if (!this.isFiltered) return this.projects;

			const query = this.searchQuery.toLowerCase();
			return this.projects.filter((project) => {
				const matchesSkills = this.filters.skills.length === 0 || project.skills.some((skill) => this.filters.skills.includes(skill.id));
				const matchesQuery =
					!query ||
					project.title.toLowerCase().includes(query) ||
					(project.summary ?? "").toLowerCase().includes(query) ||
					project.skills.some((skill) => skill.label.toLowerCase().includes(query)) ||
					(project.highlights || []).some((highlight) => highlight.toLowerCase().includes(query));
				return matchesQuery && matchesSkills;
			});
		},
		get filteredProjectIds() {
			return this.filteredProjects.map((project) => project.id);
		},

		isSkillActive(id) {
			return this.filters.skills.includes(id);
		},
		isOptionShown(label) {
			const query = this.skillQuery.trim().toLowerCase();
			return !query || label.includes(query);
		},

		toggleFilter: filterMixin.toggleFilter,
		clearFilters: filterMixin.clearFilters,
	};
}

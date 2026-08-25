import { createFilterMixin } from "./filterMixin.js";

export function projectsComponent({ projects, skills }) {
	const usedSkills = [
		...projects.reduce((set, project) => {
			project.skills.forEach((skill) => {
				set.add(skill.id);
			});
			return set;
		}, new Set()),
	];
	skills = skills.filter((p) => usedSkills.includes(p.id));
	const filterMixin = createFilterMixin({
		sectionId: "project-display",
		clearMap: {
			searchQuery: "",
			skillQuery: "",
			filters: () => ({
				skills: [],
			}),
		},
	});

	return {
		projects: [...projects],
		skills: [...skills],
		isFullscreen: false,
		searchQuery: "",
		skillQuery: "",
		filters: {
			skills: [],
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
			return !!this.filters.skills.length || this.searchQuery;
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
			return this.skills.filter((p) => p.label.toLowerCase().includes(query));
		},
		get filteredProjects() {
			if (!this.isFiltered) return this.projects;

			const query = this.searchQuery.toLowerCase();
			return this.projects.filter((project) => {
				const matchesSkills = this.filters.skills.length === 0 || project.skills.some((skill) => this.filters.skills.includes(skill.id));
				const matchesQuery =
					!query ||
					project.title.toLowerCase().includes(query) ||
					project.summary.toLowerCase().includes(query) ||
					project.skills.some((skill) => skill.label.toLowerCase().includes(query)) ||
					(project.highlights || []).some((highlight) => highlight.toLowerCase().includes(query));
				return matchesQuery && matchesSkills;
			});
		},
		get filteredProjectIds() {
			return this.filteredProjects.map((skill) => skill.id) ?? [];
		},
		toggleFilter: filterMixin.toggleFilter,
		clearFilters: filterMixin.clearFilters,
	};
}

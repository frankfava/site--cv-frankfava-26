function scrollToSection(sectionId) {
	const target = document.getElementById(sectionId)?.closest("section");
	if (target) {
		window.scrollTo({ top: target.offsetTop - 150, behavior: "smooth" });
	}
}

export function createFilterMixin({ sectionId, beforeToggle, beforeClear, clearMap }) {
	return {
		toggleFilter(type, value, replace = false) {
			if (typeof beforeToggle === "function") {
				beforeToggle.call(this, type, value, replace);
			}
			if (this.filters[type].includes(value)) {
				this.filters[type] = this.filters[type].filter((item) => item !== value);
			} else if (replace) {
				this.filters[type] = [value];
			} else {
				this.filters[type].push(value);
			}
			scrollToSection(sectionId);
		},
		clearFilters() {
			if (typeof beforeClear === "function") {
				beforeClear.call(this);
			}
			Object.entries(clearMap).forEach(([key, resetValue]) => {
				this[key] = typeof resetValue === "function" ? resetValue() : resetValue;
			});
		},
	};
}

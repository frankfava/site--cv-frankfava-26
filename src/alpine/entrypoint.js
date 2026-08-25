import { themeToggle } from "./themeToggle.js";
import { skillsComponent } from "./skillsComponent.js";
import { projectsComponent } from "./projectsComponent.js";
import { workHistoryAccordion } from "./workHistoryAccordion.js";

export default (Alpine) => {
	Alpine.data("themeToggle", themeToggle);
	
	Alpine.data("skillsComponent", skillsComponent);
	Alpine.data("projectsComponent", projectsComponent);
	Alpine.data("workHistoryAccordion", workHistoryAccordion);
};

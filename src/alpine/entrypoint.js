import { themeToggle } from "./themeToggle.js";
import { skillsComponent } from "./skillsComponent.js";
import { workHistoryAccordion } from "./workHistoryAccordion.js";

export default (Alpine) => {
	Alpine.data("themeToggle", themeToggle);
	
	Alpine.data("skillsComponent", skillsComponent);
	Alpine.data("workHistoryAccordion", workHistoryAccordion);
};

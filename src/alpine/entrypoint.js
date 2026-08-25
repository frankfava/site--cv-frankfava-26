import { themeToggle } from "./themeToggle.js";
import { skillsComponent } from "./skillsComponent.js";

export default (Alpine) => {
	Alpine.data("themeToggle", themeToggle);
	
	Alpine.data("skillsComponent", skillsComponent);
};

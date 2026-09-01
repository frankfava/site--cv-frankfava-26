import { themeToggle } from "./themeToggle.js";
import { skillsComponent } from "./skillsComponent.js";
import { projectsComponent } from "./projectsComponent.js";
import { workHistoryAccordion } from "./collections/workHistoryAccordion.js";
import { particleField } from "./backgrounds/particleField.js";
import { orb } from "./backgrounds/orb.js";
import { hologram } from "./backgrounds/hologram.js";
import { capabilityStore, capabilityPanel, capabilityRow, fitDial, CAPABILITY_STORE } from "./capability";
import { careerStore, careerTimeline, careerYearLabel, careerDot, careerBar, careerDoughnut, careerArc, CAREER_STORE } from "./career";
import { pickerStore, picker, pickerItem, PICKER_STORE } from "./picker";

export default (Alpine) => {
	Alpine.data("themeToggle", themeToggle);

	Alpine.data("skillsComponent", skillsComponent);
	Alpine.data("projectsComponent", projectsComponent);
	Alpine.data("workHistoryAccordion", workHistoryAccordion);

	Alpine.data("particleField", particleField);
	Alpine.data("orb", orb);
	Alpine.data("hologram", hologram);

	Alpine.store(CAPABILITY_STORE, capabilityStore());
	Alpine.data("capabilityPanel", capabilityPanel);
	Alpine.data("capabilityRow", capabilityRow);
	Alpine.data("fitDial", fitDial);

	Alpine.store(CAREER_STORE, careerStore());
	Alpine.data("careerTimeline", careerTimeline);
	Alpine.data("careerYearLabel", careerYearLabel);
	Alpine.data("careerDot", careerDot);
	Alpine.data("careerBar", careerBar);
	Alpine.data("careerDoughnut", careerDoughnut);
	Alpine.data("careerArc", careerArc);

	Alpine.store(PICKER_STORE, pickerStore());
	Alpine.data("picker", picker);
	Alpine.data("pickerItem", pickerItem);
};

function initReducedMotion() {
	if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		document.documentElement.classList.add("motion-safe:scroll-smooth");
	}
	window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
		document.documentElement.classList.toggle("motion-safe:scroll-smooth", !e.matches);
	});
}

/**
 * Init
 */
const setup = () => {
	initReducedMotion();
};

const refreshOnResize = () => {
	//
};

const loadIt = () => {
	setup();

	let timeout;
	window.addEventListener("resize", () => {
		clearTimeout(timeout);
		timeout = setTimeout(refreshOnResize, 100);
	});
};

loadIt();
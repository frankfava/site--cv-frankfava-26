import { SIDEBAR } from "site:config";
import { BREAKPOINTS } from "@/lib/_theme.generated";
import { attachEvent, readStored, writeStored } from "./utils";

/**
 * Mobile Class
 */
function initMobileClass() {
	const mobileClass = "mobile";

	function toggleMobileClass(isMobile) {
		window.dispatchEvent(new CustomEvent("on:mobile", { detail: { isMobile: !!isMobile } }));
		document.body.classList.toggle(mobileClass, isMobile);
	}

	const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}`);
	toggleMobileClass(!isDesktop.matches);
	isDesktop.addEventListener("change", (e) => toggleMobileClass(!e.matches));
}

/**
 * Sidebar Nav. Drives the `[data-menu-toggle]` toggle buttons
 * and sidebar visibility.
 */
function initSidebar() {
	
	const toggles = {
		toggleAttr: SIDEBAR.toggleAttr,
		// Every toggle reflects the same state, so they never disagree.
		els: () => document.querySelectorAll(`[${toggles.toggleAttr}]`),
		toggle: (open) => {
			toggles.els().forEach((el) => {
				el.classList.toggle("expanded", open);
				el.setAttribute("aria-expanded", open ? "true" : "false");
			});
		},
	};

	const sidebar = {
		sidebarShowClass: "nav-menu-open",
		storageKey: SIDEBAR.storageKey,
		autoHideAt: BREAKPOINTS[SIDEBAR.autoHideAt],
		isOpen: () => document.documentElement.classList.contains(sidebar.sidebarShowClass),
		toggleClass: (open) => {
			document.documentElement.classList.toggle(sidebar.sidebarShowClass, open);
		},
		preference: () => readStored(sidebar.storageKey) !== "false",
		open: () => {
			sidebar.toggleClass(true);
			toggles.toggle(true);
		},
		close: () => {
			sidebar.toggleClass(false);
			toggles.toggle(false);
		},
	};

	// Toggle Sidebar Nav
	attachEvent(`[${toggles.toggleAttr}]`, "click", function (_) {
		const open = !sidebar.isOpen();
		open ? sidebar.open() : sidebar.close();
		writeStored(sidebar.storageKey, open ? "true" : "false");
	});

	// Close Sidebar Nav on click, only where it covers the page
	attachEvent("[data-sidebar-bay] a", "click", () => {
		if (!document.body.classList.contains("mobile")) {
			return;
		}
		sidebar.close();
	});

	// Close Sidebar Nav on viewport change, reopen only if preference allows
	window.matchMedia(`(min-width: ${sidebar.autoHideAt})`).addEventListener("change", (e) => {
		!e.matches || !sidebar.preference() ? sidebar.close() : sidebar.open();
	});

	// Close Sidebar Nav on mobile change
	attachEvent("window", "on:mobile", function (e) {
		if (e.detail.isMobile) {
			sidebar.close();
		}
	});
}

/**
 * Sidebar Height
 * 
 * Make sure the sidebar is the correct height when the page is loaded.
 * Under the hero, its partially hidden, so we need to make sure it's the correct height to scroll
 */
function initSidebarHeight() {
	const bay = document.querySelector("[data-sidebar-bay]");
	if (!bay) return;

	function apply() {
		const style = getComputedStyle(bay);
		if (style.position !== "sticky") {
			bay.style.removeProperty("height");
			return;
		}
		const pinnedTop = parseFloat(style.top) || 0;
		const available = window.innerHeight - bay.getBoundingClientRect().top;
		bay.style.height = `${Math.min(available, window.innerHeight - pinnedTop)}px`;
	}

	attachEvent("window", "scroll", apply);
	attachEvent("window", "resize", apply);
	attachEvent("window", "load", apply);
	document.fonts?.ready.then(apply);
	apply();
}

/**
 * Init
 */
const setup = () => {
	initMobileClass();
	initSidebar();
	initSidebarHeight();
};

const refreshOnResize = () => {
	//
};

const loadIt = () => {
	document.documentElement.classList.add("motion-safe:scroll-smooth");

	setup();

	let timeout;
	window.addEventListener("resize", () => {
		clearTimeout(timeout);
		timeout = setTimeout(refreshOnResize, 100);
	});
};

loadIt();

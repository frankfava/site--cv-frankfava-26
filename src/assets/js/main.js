import { SIDEBAR } from "site:config";
import { BREAKPOINTS } from "@/lib/_theme.generated";
import { attachEvent, readStored, writeStored, scroll } from "./utils";

/**
 * Mobile Class
 */
function initMobileClass() {
	const mobileClass = "mobile";

	function toggleMobileClass(isMobile) {
		window.dispatchEvent(new CustomEvent("on:mobile", { detail: { isMobile: !!isMobile } }));
		document.body.classList.toggle(mobileClass, isMobile);
	}

	const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINTS.lg})`);
	toggleMobileClass(!isDesktop.matches);
	isDesktop.addEventListener("change", (e) => toggleMobileClass(!e.matches));
}

/**
 * Scroll
 *
 * Header state and the progress bar, off one read of the document position.
 */
function initScroll() {
	const header = document.querySelector("#header[data-sticky-header]");
	const bar = document.getElementById("scroll-progress")?.querySelector("div:first-child");
	if (!header && !bar) return;

	let ticking = false;

	function apply() {
		ticking = false;

		if (header) {
			const scrolled = window.scrollY > header.offsetHeight - 40;
			if (scrolled !== document.body.classList.contains("scroll")) {
				document.body.classList.toggle("scroll", scrolled);
				window.dispatchEvent(new CustomEvent("scrolled", { detail: { show: scrolled } }));
			}
		}

		if (bar) {
			const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			bar.style.width = `${max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max)) * 100}%`;
		}
	}

	attachEvent([document], "scroll", () => {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(apply);
	});
	attachEvent("window", "resize", apply);
	attachEvent("window", "load", apply);
	apply();
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
		// Mark the sidebar bay as inert when it is closed, so it doesn't interfere with the tab order.
		syncInert: () => {
			const bay = document.querySelector("[data-sidebar-bay]");
			if (!bay) return;
			sidebar.isOpen() ? bay.removeAttribute("inert") : bay.setAttribute("inert", "");
		},
		open: () => {
			sidebar.toggleClass(true);
			toggles.toggle(true);
			sidebar.syncInert();
		},
		close: () => {
			sidebar.toggleClass(false);
			toggles.toggle(false);
			sidebar.syncInert();
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

	// Close Sidebar Nav on scrim click, only rendered where it covers the page
	attachEvent("[data-sidebar-scrim]", "click", () => sidebar.close());

	// Close Sidebar Nav on Escape
	attachEvent([document], "keydown", (e) => {
		if (e.key === "Escape") sidebar.close();
	});

	// Close Sidebar Nav on mobile change
	attachEvent("window", "on:mobile", function (e) {
		if (e.detail.isMobile) {
			sidebar.close();
		}
		sidebar.syncInert();
	});

	// Auto Show Sidebar (desktop only, respect saved preference)
	setTimeout(() => {
		if (sidebar.isOpen() || SIDEBAR.onLoad !== "reveal" || !window.matchMedia(`(min-width: ${sidebar.autoHideAt})`).matches || !sidebar.preference()) return;
		sidebar.open();
	}, 500);

	sidebar.syncInert();
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
 * Scroll Spy
 *
 * One read of where you are, feeding the index and rail links.
 */
function initScrollSpy() {
	const anchors = Array.from(document.querySelectorAll("[data-section-link]")).filter((a) => a.getAttribute("href")?.startsWith("#"));
	const ids = [...new Set(anchors.map((a) => a.getAttribute("href").slice(1)))];

	const readouts = document.querySelectorAll("[data-read-progress]");
	const parents = new Map();
	const lists = new Map();
	anchors.forEach((a) => {
		const parent = a.closest("li")?.parentElement?.closest("li")?.querySelector("a[data-section-link]");
		if (parent) parents.set(a.getAttribute("href"), parent.getAttribute("href"));

		const list = a.closest("nav") ?? document.body;
		lists.set(list, [...(lists.get(list) ?? []), a]);
	});

	const sections = () => (ids.length ? ids.map((id) => document.getElementById(id)) : Array.from(document.querySelectorAll("main section[id]"))).filter(Boolean);
	if (!sections().length) return;

	// Where a section takes over. Raise the fraction to hand over sooner.
	const line = () => (document.querySelector("#header")?.getBoundingClientRect().height ?? 0) + window.innerHeight * 0.25;

	let current;
	let hashTimer;

	function resolve(els) {
		const at = line();

		// A short last section never reaches the line.
		if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
			return els[els.length - 1];
		}

		// The hero still owns the screen.
		if (els[0].getBoundingClientRect().top > at) {
			return null;
		}

		return (
			els.find((el) => {
				const rect = el.getBoundingClientRect();
				return rect.top <= at && rect.bottom > at;
			}) ??
			els.find((el) => el.getBoundingClientRect().top > at) ??
			els[els.length - 1]
		);
	}

	function apply() {
		const els = sections();
		if (!els.length) return;

		// Across the sections, not the document: no hero, no footer.
		if (readouts.length) {
			const from = els[0].getBoundingClientRect().top + window.scrollY;
			const to = els[els.length - 1].getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
			const read = to > from ? Math.min(1, Math.max(0, (window.scrollY - from) / (to - from))) : Number(window.scrollY >= from);
			readouts.forEach((el) => (el.textContent = `${Math.round(read * 100)}%`));
		}

		const id = resolve(els)?.id ?? null;
		if (id === current) return;
		current = id;

		// One mark per list; a list without its own entry falls back to the ancestor.
		lists.forEach((list) => {
			let href = id ? `#${id}` : null;
			while (href && !list.some((a) => a.getAttribute("href") === href)) {
				href = parents.get(href) ?? null;
			}
			list.forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === href));
		});

		// Safari throws past 100 replaceState calls in 30 seconds.
		clearTimeout(hashTimer);
		hashTimer = setTimeout(() => history.replaceState(null, "", id ? `#${id}` : window.location.pathname), 150);
	}

	let ticking = false;
	attachEvent([document], "scroll", () => {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(() => {
			apply();
			ticking = false;
		});
	});

	attachEvent("window", "resize", apply);
	attachEvent("window", "load", apply);
	apply();
}

/**
 * Jump Links
 */
function jumpLinks() {
	const jumpLinks = document.querySelectorAll("a");
	if (!jumpLinks.length) return;

	// Filter out links that start with a #
	const hashLinks = Array.from(jumpLinks).filter((link) => link.getAttribute("href")?.startsWith("#"));

	hashLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			const href = link.getAttribute("href");
			e.preventDefault();
			if (href != "#") {
				const target = document.querySelector(href);
				if (target) {
					scroll.intoView(target);
				}
			}
		});
	});
}

/**
 * Scroll page with hash
 */
function handleUrlHash() {
	if (window.location.hash) {
		const target = document.querySelector(window.location.hash);
		if (!target) return;
		scroll.intoView(target);
	} else {
		scroll.to(0);
	}
}

/**
 * Copy to clipboard Links
 */
async function handleCopyToClipboardLinks() {
	const copyLinks = document.querySelectorAll("a.copy-to-clipboard");
	if (!copyLinks.length) return;

	copyLinks.forEach((link) => {
		link.addEventListener("click", async (e) => {
			e.preventDefault();
			const { default: Swal } = await import("sweetalert2");
			const textToCopy = link.getAttribute("data-copy") ?? link.textContent;
			if (!textToCopy) {
				return;
			}

			await window.navigator.clipboard.writeText(textToCopy);

			Swal.fire({
				title: "Copied to Clipboard",
				text: textToCopy,
				icon: "success",
				showConfirmButton: false,
				timer: 1500,
			});
		});
	});
}


/**
 * Init
 */
const setup = () => {
	initMobileClass();
	initScroll();
	initSidebar();
	initSidebarHeight();
	initScrollSpy();
	jumpLinks();
	handleUrlHash();
	handleCopyToClipboardLinks();
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

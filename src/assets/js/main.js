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
 */
function initHeaderScroll() {
	const header = document.querySelector("#header[data-sticky-header]");
	if (!header) return;

	let lastKnownScrollPosition = window.scrollY;
	let ticking = true;

	function applyScrollClass() {
		const headerHeight = header.offsetHeight;
		const headerOffset = headerHeight - 40;

		if (lastKnownScrollPosition > headerOffset && !document.body.classList.contains("scroll")) {
			document.body.classList.add("scroll");
			window.dispatchEvent(new CustomEvent("scrolled", { detail: { show: true } }));
		} else if (lastKnownScrollPosition <= headerOffset && document.body.classList.contains("scroll")) {
			document.body.classList.remove("scroll");
			window.dispatchEvent(new CustomEvent("scrolled", { detail: { show: false } }));
		}

		ticking = false;
	}
	applyScrollClass();

	attachEvent([document], "scroll", function () {
		lastKnownScrollPosition = window.scrollY;
		if (!ticking) {
			window.requestAnimationFrame(() => {
				applyScrollClass();
			});
			ticking = true;
		}
	});
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

	// Resolved per pass rather than held, so a section that renders late is picked up.
	const sections = () => (ids.length ? ids.map((id) => document.getElementById(id)) : Array.from(document.querySelectorAll("main section[id]"))).filter(Boolean);
	if (!sections().length) return;

	// The reading line sits under the header, wherever the header ends up.
	const line = () => (document.querySelector("#header")?.getBoundingClientRect().height ?? 0) + 24;

	let current;
	let hashTimer;

	function resolve(els) {
		const at = line();

		// A short last section never reaches the reading line, so the bottom of the
		// page counts as being in it.
		if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
			return els[els.length - 1];
		}

		// Above the first section the hero still owns the screen, and nothing in the
		// index is being read yet.
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

		const id = resolve(els)?.id ?? null;
		if (id === current) return;
		current = id;

		anchors.forEach((a) => a.classList.toggle("is-on", !!id && a.getAttribute("href") === `#${id}`));

		// Safari throws once replaceState is called more than 100 times in 30
		// seconds, which a wobble on a section boundary can reach. Waiting for the
		// crossings to settle means a burst writes once, at the end.
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
 * Read Progress
 *
 * How far down the page you are, in its two renderings: the bar under the
 * header and the percentage in the bay. Neither has to be on the page.
 */
function initReadProgress() {
	const bar = document.getElementById("scroll-progress")?.querySelector("div:first-child");
	const readouts = document.querySelectorAll("[data-read-progress]");
	if (!bar && !readouts.length) return;

	function apply() {
		const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const read = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));

		if (bar) bar.style.width = `${read * 100}%`;
		readouts.forEach((el) => (el.textContent = `${Math.round(read * 100)}%`));
	}

	attachEvent([document], "scroll", apply);
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
	initHeaderScroll();
	initSidebar();
	initSidebarHeight();
	initScrollSpy();
	initReadProgress();
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

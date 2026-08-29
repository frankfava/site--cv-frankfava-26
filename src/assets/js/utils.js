export const ready = (fn = () => true) => {
	document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn);
};

export function attachEvent(selector, event, fn) {
	const matches = typeof selector === "string" ? (selector == "window" ? [window] : document.querySelectorAll(selector)) : selector;
	if (matches && matches.length) {
		matches.forEach((elem) => {
			elem.addEventListener(event, (e) => fn(e, elem), false);
		});
	}
}

export const media = {
	reducedMotion: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
	transparency: window.matchMedia(`(prefers-transparency: prefer-reduced)`).matches,
};

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const scroll = {
	position: () => ({
		x: window.scrollX,
		y: window.scrollY,
	}),
	top: () => scroll.position().y,
	bottom: () => scroll.position().y + window.innerHeight,
	max: () => document.documentElement.scrollHeight - document.documentElement.clientHeight,
	atEnd: () => window.scrollY >= scroll.max() - 2,
	intoView: (target) => {
		target.scrollIntoView({ behavior: media.reducedMotion ? "instant" : "smooth" });
	},
	to: (offset = 0) => {
		window.scrollTo({ top: offset, behavior: media.reducedMotion ? "instant" : "smooth" });
	},
}

/** localStorage throws in private mode; every caller wants the same fallback. */
export const readStored = (key, fallback = null) => {
	try {
		return key in localStorage ? localStorage.getItem(key) : fallback;
	} catch {
		return fallback;
	}
};

export const writeStored = (key, value) => {
	try {
		localStorage.setItem(key, value);
	} catch {
		/* private mode */
	}
};

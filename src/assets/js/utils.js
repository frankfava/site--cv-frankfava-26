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

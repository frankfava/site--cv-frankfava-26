export default shadesOf;

/**
 * Generate Tailwind-compatible shades from a single color
 * @param {string} hex The hex code to generate shades from
 * @param {defaultShade} halfShades Generate default shades, e.g. DEFAULT
 * @param {boolean} halfShades Generate additional shades, e.g. at 150
 * @returns {{[key: number]: string}}
 */
function shadesOf(hex, { defaultShade = true, halfShades = false, useVarName = null } = {}) {
	const baseColor = hexToRgb(hex).toArray();
	const black = [0, 0, 0];
	const white = [255, 255, 255];

	let shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
	if (halfShades) shades = [...shades, 150, 250, 350, 450, 550, 650, 750, 850].sort();

	const result = {};

	if (defaultShade) {
		result.DEFAULT = hex;
	}

	for (let shade of shades) {
		const originalShade = shade;

		if (shade === 500) {
			result[shade] = hex;
			continue;
		}

		const isDarkShade = shade > 500;
		if (isDarkShade) shade -= 500;

		const percentage = shade / 500;
		const startColor = isDarkShade ? black : baseColor;
		const endColor = isDarkShade ? baseColor : white;

		const color = getColor(percentage, startColor, endColor);

		let value = "";
		if (useVarName && typeof useVarName === "string") {
			value = `var(--${useVarName}-${shade},${color})`;
		} else {
			value = color;
		}

		result[originalShade] = value;
	}

	return result;
}

export function hexToRgb(hex) {
	const originalHex = hex;
	const hexTestRegex = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i;
	if (!hexTestRegex.test(hex)) {
		throw new Error(`Invalid hex color provided: ${originalHex}`);
	}

	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	const parsed = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsed);

	const r = result[1];
	const g = result[2];
	const b = result[3];

	const rgb = [r, g, b].map((channel) => {
		try {
			const ch = Number.parseInt(channel, 16);
			if (ch < 0 || ch > 255) throw new Error();
			return ch;
		} catch {
			throw new Error(`Invalid hex color provided: ${originalHex}`);
		}
	});

	return {
		r,
		g,
		b,
		toArray: () => rgb,
		toString: () => `rgb(${rgb.join(", ")})`,
	};
}

export function rgbToHex(r, g, b) {
	return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function addAlpha(hex, opacity) {
	// coerce values so it is between 0 and 1.
	var _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
	return hex + _opacity.toString(16).toUpperCase();
}

function getColor(percentage, start, end) {
	const rgb = end.map((channel, index) => {
		return Math.round(channel + percentage * (start[index] - channel));
	});

	const hex = `#${rgb
		.map((channel) => {
			const component = channel.toString(16);
			if (component.length === 1) return `0${component}`;
			return component;
		})
		.join("")}`;
	return hex;
}

/** Radar geometry for the capability check. */
import { CAPABILITIES } from "@/data/capabilities";

const GEOMETRY = { cx: 180, cy: 140, radius: 92 };

/** Closer than this to the centre and a label reads as sitting on the axis. */
const CENTRED_WITHIN = 6;

const count = CAPABILITIES.length;

function point(index: number, value: number): [number, number] {
	const angle = -Math.PI / 2 + index * ((2 * Math.PI) / count);
	const distance = GEOMETRY.radius * (value / 100);
	return [GEOMETRY.cx + Math.cos(angle) * distance, GEOMETRY.cy + Math.sin(angle) * distance];
}

/** The closed path through one value per capability. */
export function radarPath(values: number[]): string {
	const steps = values.map((value, i) => {
		const [x, y] = point(i, value);
		return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
	});

	return `${steps.join(" ")} Z`;
}

/** What the radar draws at build time. */
export const radar = {
	...GEOMETRY,
	viewBox: "0 0 360 296",
	rings: [0.25, 0.5, 0.75, 1].map((fraction) => radarPath(CAPABILITIES.map(() => fraction * 100))),
	spokes: CAPABILITIES.map((cap, i) => {
		const [x2, y2] = point(i, 100);
		const [labelX, labelY] = point(i, 118);
		const offset = labelX - GEOMETRY.cx;
		return {
			x2,
			y2,
			labelX,
			labelY: labelY + 4,
			label: cap.short.toUpperCase(),
			anchor: Math.abs(offset) <= CENTRED_WITHIN ? "middle" : offset < 0 ? "end" : "start",
		};
	}),
	mineShape: radarPath(CAPABILITIES.map((c) => c.sits)),
	yoursShape: radarPath(CAPABILITIES.map((c) => c.defaultNeed)),
};

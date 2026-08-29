/** Geometry for the career timeline: the line chart, and the read-out ring. */
export const CHART = { W: 980, H: 260, LEFT: 40, RIGHT: 16, TOP: 14, BOTTOM: 32 };

export function chartX(index: number, count: number): number {
	return CHART.LEFT + (index * (CHART.W - CHART.LEFT - CHART.RIGHT)) / (count - 1);
}

export function chartY(value: number): number {
	return CHART.TOP + ((100 - value) * (CHART.H - CHART.TOP - CHART.BOTTOM)) / 100;
}

/** One arc's dash. Segments take a share of the ring; rings take their own value. */
export function arcSpan({ variant, value, total, circumference, gap }: { variant: "rings" | "segments"; value: number; total: number; circumference: number; gap: number }): {
	drawn: number;
	rest: number;
} {
	const filled = variant === "segments" ? value / total : value / 100;

	// A segment ends exactly where the next begins, so each gives up a gap or the
	// last one seams over the first at the top of the circle.
	const drawn = Math.max(0, circumference * filled - (variant === "segments" ? gap : 0));

	return { drawn, rest: circumference - drawn };
}

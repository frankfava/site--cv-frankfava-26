/** Chart geometry for the career timeline. */
export const CHART = { W: 980, H: 260, LEFT: 40, RIGHT: 16, TOP: 14, BOTTOM: 32 };

export function chartX(index: number, count: number): number {
	return CHART.LEFT + (index * (CHART.W - CHART.LEFT - CHART.RIGHT)) / (count - 1);
}

export function chartY(value: number): number {
	return CHART.TOP + ((100 - value) * (CHART.H - CHART.TOP - CHART.BOTTOM)) / 100;
}

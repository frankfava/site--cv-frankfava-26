/**
 * The spans the copy quotes as numbers.
 *
 * Only open spans belong here. A span that has closed is permanently true and
 * a literal says it fine; an open one moves on its own anniversary, which is
 * why the same figure reads correct for a year and then quietly stops.
 *
 * Read synchronously from the collection's own JSON rather than through
 * `astro:content`, because most of the copy lives in plain data modules that
 * export a const at module scope and cannot await anything.
 */
import type { WorkHistoryId } from "content:ids";
import workHistory from "@/data/workHistory.json";

const startDates = new Map(workHistory.map(({ id, startDate }) => [id, new Date(startDate)]));

/** Whole years elapsed, so a figure turns over on the anniversary and not before it. */
export function fullYearsBetween(start: Date, end: Date = new Date()): number {
	const elapsed = end.getFullYear() - start.getFullYear();
	const beforeAnniversary = end.getMonth() < start.getMonth() || (end.getMonth() === start.getMonth() && end.getDate() < start.getDate());
	return beforeAnniversary ? elapsed - 1 : elapsed;
}

/** Where the working life starts: the earliest role on the record. */
export function careerStart(): Date {
	return new Date(Math.min(...[...startDates.values()].map(Number)));
}

/** The working life. Longer than the paid software work, shorter than the coding. */
export function careerYears(): number {
	return fullYearsBetween(careerStart());
}

/** Whole years since a role began. Only meaningful while the role is still running. */
export function yearsIn(id: WorkHistoryId): number {
	const start = startDates.get(id);
	return start ? fullYearsBetween(start) : 0;
}

/** The year a role began, for copy that names the date instead of counting from it. */
export function startYearOf(id: WorkHistoryId): number {
	return startDates.get(id)?.getFullYear() ?? 0;
}

export function roleCount(): number {
	return workHistory.length;
}

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

/** The arrival in Stockholm. Not a role, so the collection does not carry it. */
const STOCKHOLM_ARRIVAL = new Date("2019-11-01T00:00:00.000Z");

/** Whole years living in Stockholm. */
export function stockholmYears(): number {
	return fullYearsBetween(STOCKHOLM_ARRIVAL);
}

/** The month of the move, for copy that names it instead of counting from it. */
export function stockholmArrival(): Date {
	return new Date(STOCKHOLM_ARRIVAL);
}

/** Where the working life starts: the earliest role on the record. */
export function careerStart(): Date {
	return new Date(Math.min(...[...startDates.values()].map(Number)));
}

/** The working life. Longer than the paid software work, shorter than the coding. */
export function careerYears(): number {
	return fullYearsBetween(careerStart());
}

/** The first role paid for writing code. The career starts earlier, in coaching. */
const CODING_START_ID: WorkHistoryId = "flic-sites";

/** Where the paid software work starts, for copy that names the year. */
export function codingStart(): Date {
	return new Date(startDates.get(CODING_START_ID) ?? careerStart());
}

/** The paid software work. Inside the career and shorter than it. */
export function codingYears(): number {
	return fullYearsBetween(codingStart());
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

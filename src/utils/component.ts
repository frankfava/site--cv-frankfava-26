/**
 * A component with some of its props already set, for the places that take a
 * component rather than markup - `Picker`'s `panel`, say.
 *
 * Astro has no partial application of its own, so this reaches into the runtime
 * that renders a component. The cast is the price: `createComponent` types its
 * callback as returning a template result while `renderComponent` returns a
 * render instance, and the two only compose at runtime.
 */
import { createComponent, renderComponent, type AstroComponentFactory } from "astro/runtime/server/index.js";

/** Bound props win, so a caller cannot undo what was set here. */
export const withProps = (Component: AstroComponentFactory, bound: Record<string, unknown>): AstroComponentFactory =>
	createComponent(((result: any, props: any, slots: any) => renderComponent(result, "Bound", Component, { ...props, ...bound }, slots)) as any);

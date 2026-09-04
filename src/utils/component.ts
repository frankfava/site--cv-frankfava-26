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

/** The props a component factory accepts. */
type PropsOf<T> = T extends (props: infer P, ...rest: never[]) => unknown ? P : never;

/**
 * A lazily imported component with some of its props already set, for the places
 * that take a loader rather than a component - a part's `content`, say.
 *
 * The module is spread rather than replaced, so a part that also exports
 * `resolve` keeps deciding its own visibility.
 */
export const withPropsAsync =
	<M extends { default: AstroComponentFactory }>(loader: () => Promise<M>, bound?: Partial<PropsOf<M["default"]>>) =>
	async (): Promise<M> => {
		const mod = await loader();
		return { ...mod, default: withProps(mod.default, (bound ?? {}) as Record<string, unknown>) };
	};

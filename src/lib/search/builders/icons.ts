import type { AtomicKind } from "../types";
import type { IconRenderer } from "./types";

/** What a row of each kind shows where its own data carries no usable icon. */
export const ATOMIC_ICON: Record<AtomicKind, string> = {
	skill: "ph:tag",
	project: "ph:rocket-launch",
	role: "ph:briefcase",
	certification: "ph:certificate",
	language: "ph:translate",
	transferable: "ph:lightbulb-filament",
};

/** What a social row shows where the link carries no icon. */
export const SOCIAL_ICON = "ph:link";

/**
 * The row's own icon, or the plain glyph for its kind.
 *
 * The renderer returns nothing for a name it cannot draw or one that costs more
 * than a row's icon is worth, so both cases land here.
 */
export async function iconOrFallback(renderIcon: IconRenderer, name: string | undefined, fallback: string): Promise<string> {
	return (name ? await renderIcon(name) : "") || (await renderIcon(fallback));
}

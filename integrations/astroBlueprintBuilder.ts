import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";
import { resolve } from "node:path";

export function astroBlueprintBuilder(): AstroIntegration {
	return {
		name: "astro:blueprint:builder",
		hooks: {
			"astro:config:setup": ({ config, updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [blueprintHmrPlugin([resolve(config.srcDir.pathname, "blueprints"), resolve(config.srcDir.pathname, "components/blueprints")])],
					},
				});
			},
		},
	};
}

function blueprintHmrPlugin(blueprintsDir: string | string[]): Plugin {
	const dirs = (Array.isArray(blueprintsDir) ? blueprintsDir : [blueprintsDir]).filter(Boolean).map((d) => d.replace(/\\/g, "/"));
	const globs = dirs.map((d) => `${d}/**/*.astro`);

	return {
		name: "astro:blueprint:hmr",
		configureServer(server) {
			for (const g of globs) server.watcher.add(g);
		},
		handleHotUpdate({ file, server }) {
			if (!file.endsWith(".astro") || !dirs.some((d) => file.startsWith(d))) return;
			const mods = server.moduleGraph.getModulesByFile(file);
			if (mods) for (const m of mods) server.moduleGraph.invalidateModule(m);
			server.ws.send({ type: "full-reload" });
			return [];
		},
	};
}

import fs from "node:fs";
import { resolve, extname, dirname } from "node:path";
import type { AstroIntegration } from "astro";

const loggerId = "generateCollectionTypes";

type jsonCollectionPath = string;
type enumExportName = string;
type collectionKey = string;

type IntegrationConfig = {
	outputPath: string;
	map: Record<jsonCollectionPath, Record<enumExportName, collectionKey | { key: collectionKey; isArray?: boolean }>>;
};

export function generateCollectionTypes(options: IntegrationConfig): AstroIntegration {
	return {
		name: "generate:collection:types",
		hooks: {
			"astro:config:setup": async ({ logger, addWatchFile }) => {
				const buildLogger = logger.fork(loggerId);

				const outputPath = resolve(options.outputPath);
				const outputDir = dirname(outputPath);
				const collectionMap = options.map ?? [];

				if (!fs.existsSync(outputDir)) {
					fs.mkdirSync(outputDir, { recursive: true });
				}

				let content = `declare module 'content:ids' {\n\n`;
				let generatedExports: enumExportName[] = [];

				Object.entries(collectionMap).forEach(([path, map]) => {
					if (extname(path) != ".json") {
						buildLogger.error(`${path} cannot be parsed. Only JSON collections supported.`);
						return false;
					}

					// Parse the path as JSON and generate type definition file using the id key
					try {
						const json = JSON.parse(fs.readFileSync(path, "utf-8"));
						if (!json || !Array.isArray(json)) {
							throw new Error("Invalid JSON data received");
						}

						Object.entries(map).forEach(([exportName, key]) => {
							const keyName = typeof key === "string" ? key : key.key;
							const isArray = typeof key === "object" && key.isArray;

							let values = (isArray ? [...new Set(json.reduce((acc, object) => acc.concat(object[keyName]), [] as string[]))] : json.map((item) => item[keyName])).filter(Boolean);

							content += `\t// "${exportName}" type for ${path} collection (generated)\n`;

							content += `\texport type ${exportName} = \n`;
							values.forEach((v, i) => {
								content += `\t\t | "${v}"`;
								content += i + 1 == values.length ? ";" : "\n";
							});
							content += `\n\n`;

							generatedExports.push(exportName);
						});

						addWatchFile(resolve(path));
					} catch (error) {
						buildLogger.error(`Error parsing JSON from ${path}: ${error}`);
					}
				});

				content += `}`;

				if (!!generatedExports.length) {
					fs.writeFileSync(outputPath, content, "utf-8");
					buildLogger.info(`Generated type definitions for ids of collections: ${generatedExports.join(", ")} as "content:ids" module at ${outputPath}`);
				}
			},
		},
	};
}

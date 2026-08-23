import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** */
export const getProjectRootDir = (): string => {
	const mode = import.meta.env.MODE;

	return mode === "production" ? path.join(__dirname, "../") : path.join(__dirname, "../../");
};

export const __srcFolder = path.join(getProjectRootDir(), "/src");

export const __configFolder = path.join(getProjectRootDir(), "/src/config");

/** */
export const getRelativeUrlByFilePath = (filepath: string): string => {
	return filepath.replace(__srcFolder, "");
};

/** */
export const joinPath = (filepath: string, base: string | null = null): string => {
	base ??= getProjectRootDir();
	return path.resolve(base, filepath);
};

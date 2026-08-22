import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";

const isDev = process.env.NODE_ENV == "development";

// https://astro.build/config
export default defineConfig({
  adapter: isDev ? undefined : netlify(),
});
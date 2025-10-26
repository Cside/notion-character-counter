import tailwindcss from "@tailwindcss/vite";
import { defineConfig, WxtViteConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["storage", "unlimitedStorage", "webNavigation"],
  },
  vite: () =>
    ({
      plugins: [tailwindcss()],
    } as WxtViteConfig),
});

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, WxtViteConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["webNavigation"],
  },
  vite: () =>
    ({
      plugins: [tailwindcss()],
    } as WxtViteConfig),
});

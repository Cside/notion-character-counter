import tailwindcss from "@tailwindcss/vite";
import { defineConfig, WxtViteConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () =>
    ({
      plugins: [tailwindcss()],
    } as WxtViteConfig),
  manifest: {
    permissions: ["tabs", "storage", "unlimitedStorage", "webNavigation"],
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    default_locale: "en"
  },
});

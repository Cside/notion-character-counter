// vitest.config.ts
import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [WxtVitest()],
});

// Object.assign(global, {
//   Browser: {
//     i18n: {
//       getUILanguage: () => "en-US",
//     },
//   },
// });

// import { fakeBrowser } from "@webext-core/fake-browser";
// import { vi } from "vitest";
//
// vi.stubGlobal("chrome", fakeBrowser);

vi.stubGlobal("chrome", {
  i18n: {
    getUILanguage: () => "en-US",
  },
});

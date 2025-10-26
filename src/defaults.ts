import { CountBy } from "./types";

export const DEFAULT_COUNT_BY: CountBy = (() => {
  const uiLanguage = chrome.i18n.getUILanguage();
  const shouldCountByCharacters = ["ja", "ko", "zh"].some((lang) =>
    uiLanguage.startsWith(lang)
  );
  return shouldCountByCharacters ? "characters" : "words";
})();

export const DEFAULT_INCLUDES_SPACES = true;

export const DEFAULT_INCLUDES_CODE_BLOCKS = true;

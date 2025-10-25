import { throttle } from "es-toolkit";

const THROTTLE_TIME = 150;

const COUNTER_STYLES = {
  // position: "fixed",
  // bottom: "20px",
  // right: "20px",
  padding: "8px 12px",
  fontSize: "14px",
  // fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  // zIndex: "9999",
};

export default defineContentScript({
  matches: ["*://www.notion.so/*"],

  main() {
    (async () => {
      await waitFor(".notion-frame .notion-scroller .layout-content"); // TODO: 重複
      const container = await waitFor(
        ".notion-topbar-action-buttons > :last-child"
      );

      // カウンター要素を作成
      const counterDiv = document.createElement("div");
      counterDiv.id = "notion-character-counter";
      Object.assign(counterDiv.style, COUNTER_STYLES);
      container.prepend(counterDiv);

      const updateCounter = throttle(() => {
        const counts = calculateNotionCharacterCounts();
        counterDiv.textContent = `文字数: ${counts.bodyWithoutSpaces}`;
      }, THROTTLE_TIME);
      updateCounter();

      let observer = new MutationObserver(updateCounter);

      // 監視を設定する関数
      const setupObserver = () => {
        const target = document.querySelector(".notion-frame .notion-scroller");
        if (!target) return;

        observer.disconnect(); // 既存の監視を解除
        observer.observe(target as Node, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      };
      setupObserver();

      chrome.runtime.onMessage.addListener(
        throttle(async ({ type }: { type: string }) => {
          if (type === "CHANGE_PAGE") {
            await waitFor(".notion-frame .notion-scroller .layout-content");
            updateCounter();
            setupObserver();
          }
        }, THROTTLE_TIME)
      );
    })();
  },
});

// ==================================================
// Utils
// ==================================================

const GET_ELEMENT_INTERVAL = 100;
const TIMEOUT = 15 * 1_000;

function waitFor(selector: string): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const getElement = (fn?: () => void) => {
      const $elem = document.querySelector<HTMLElement>(selector);
      if ($elem) {
        if (fn) fn();
        resolve($elem);
      }
    };
    getElement();

    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += GET_ELEMENT_INTERVAL;
      if (elapsed >= TIMEOUT) {
        console.error(`# Timeout for ${selector}`);
        clearInterval(id);
        return;
      }
      getElement(() => {
        clearInterval(id);
      });
    }, GET_ELEMENT_INTERVAL);
  });
}

function calculateNotionCharacterCounts(): {
  bodyWithoutSpaces: number;
  bodyWithSpaces: number;
  codeBlockWithoutSpaces: number;
  codeBlockWithSpaces: number;
} {
  /**
   * (内部ヘルパー関数)
   * 指定されたCSSセレクタに一致するDOM要素群からテキストを取得し、
   * スペース有り/無しの文字数を計算します。
   * @param selector - DOM要素を選択するためのCSSセレクタ文字列。
   * @returns スペース無しとスペース有りの文字数を含むオブジェクト。
   */
  const getTextCounts = (
    selector: string
  ): { withoutSpaces: number; withSpaces: number } => {
    // 指定されたセレクタに一致するすべての要素を取得
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === 0) {
      return { withoutSpaces: 0, withSpaces: 0 };
    }

    // 全ての要素のテキストコンテンツを1つの文字列に結合
    const combinedText = Array.from(elements)
      .map((el) => el.textContent || "")
      .join("");

    // スペース有りの文字数（元のコードに合わせて改行のみ除去）
    const withSpaces = combinedText.replace(/\n/g, "").length;

    // スペース無しの文字数（半角・全角スペース、改行などをすべて除去）
    const withoutSpaces = combinedText.replace(/[\s　]/g, "").length;

    return { withoutSpaces, withSpaces };
  };

  // --- メインの計算ロジック ---

  // Notionページの各パーツの文字数を取得
  const allText = getTextCounts("main .notranslate");
  const breadcrumb = getTextCounts(
    "main .notion-breadcrumb-block .notranslate"
  );
  const breadcrumbFirst = getTextCounts(
    "main .notion-collection_view-block .notion-record-icon + .notranslate"
  );
  const databaseTitle = getTextCounts(
    "main .notion-collection_view-block .notranslate"
  );
  const codeBlock = getTextCounts("main .notion-code-block .notranslate");
  const inlineMath = getTextCounts("main .notion-text-equation-token");

  // スペース無しの本文文字数を計算
  // 全体から、重複カウントされる要素や不要な要素を引いていく
  const bodyWithoutSpaces =
    allText.withoutSpaces -
    breadcrumb.withoutSpaces -
    databaseTitle.withoutSpaces +
    breadcrumbFirst.withoutSpaces -
    codeBlock.withoutSpaces -
    inlineMath.withoutSpaces;

  // スペース有りの本文文字数を計算
  const bodyWithSpaces =
    allText.withSpaces -
    breadcrumb.withSpaces -
    databaseTitle.withSpaces +
    breadcrumbFirst.withSpaces -
    codeBlock.withSpaces -
    inlineMath.withSpaces;

  // 計算結果を分かりやすいオブジェクトで返す
  return {
    bodyWithoutSpaces: Math.max(0, bodyWithoutSpaces), // 念のためマイナスにならないように
    bodyWithSpaces: Math.max(0, bodyWithSpaces),
    codeBlockWithoutSpaces: codeBlock.withoutSpaces,
    codeBlockWithSpaces: codeBlock.withSpaces,
  };
}

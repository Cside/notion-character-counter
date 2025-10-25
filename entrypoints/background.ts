const NOTION_BASE_URL = "https://www.notion.so/";

export default defineBackground(() => {
  chrome.webNavigation.onHistoryStateUpdated.addListener(
    async (detail) => {
      try {
        await chrome.tabs.sendMessage(detail.tabId, { type: "CHANGE_PAGE" });
      } catch (error) {
        // content script がロードされる以前に送信すると当然エラーになり、その場合は無視する
        // executeScript を駆使して content script がロードするかチェックする術もあるが
        // 通信が 1 往復多くなるし、
        // そのためだけに scripting permission を使う理由を審査時に説明するのもだるいし ... 。
        if (!(error + "").match(/Could not establish connection/)) throw error;
      }
    },
    { url: [{ urlPrefix: NOTION_BASE_URL }] }
  );
});

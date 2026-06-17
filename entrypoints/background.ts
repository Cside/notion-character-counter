const NOTION_BASE_URLS = ["https://www.notion.so/", "https://app.notion.com/"];

export default defineBackground(() => {
  // urls を配列で渡すとなぜかswが起動時クラッシュするので、1つずつ登録する
  for (const baseUrl of NOTION_BASE_URLS) {
    chrome.webNavigation.onHistoryStateUpdated.addListener(
      async (detail) => {
        try {
          await chrome.tabs.sendMessage(detail.tabId, { type: "CHANGE_PAGE" });
        } catch (error) {
          // content script がロードされる以前に送信すると当然エラーになり、その場合は無視する
          // executeScript を駆使して content script がロードするかチェックする術もあるが
          // 通信が 1 往復多くなるし、
          // そのためだけに scripting permission を使う理由を審査時に説明するのもだるいし ... 。
          if (!(error + "").match(/Could not establish connection/))
            throw error;
        }
      },
      { url: [{ urlPrefix: baseUrl }] },
    );
  }
  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "OPEN_OPTIONS_PAGE")
      await chrome.runtime.openOptionsPage();
  });

  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install")
      await chrome.tabs.create({
        url: chrome.runtime.getURL("options.html?on_installed"),
        active: true,
      });
  });
});

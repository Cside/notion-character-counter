import React, { FormEvent, useEffect, useState } from "react";

// 保存する設定値の型を定義
type CountByType = "words" | "characters";
interface Settings {
  countBy: CountByType;
  enabled: boolean;
}

function App() {
  const [settings, setSettings] = useState<Settings>({
    countBy: "words",
    enabled: true,
  });
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // コンポーネントのマウント時に設定を読み込む
  useEffect(() => {
    const restoreOptions = async () => {
      // デフォルト値を決定
      const uiLanguage = chrome.i18n.getUILanguage();
      const isCJK = ["ja", "ko", "zh"].some((lang) =>
        uiLanguage.startsWith(lang)
      );
      const defaultCountBy: CountByType = isCJK ? "characters" : "words";

      // ストレージから設定を読み込む
      chrome.storage.local.get(
        { countBy: defaultCountBy, enabled: true },
        (items: Settings) => {
          setSettings(items);
          setIsLoading(false); // 読み込み完了
        }
      );
    };

    restoreOptions();
  }, []); // 初回レンダリング時に一度だけ実行

  // フォームの値を更新するハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Saveボタンが押されたときの処理
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // PromiseベースのAPIをasync/awaitで呼び出す
      await chrome.storage.local.set(settings);

      setStatus("Saved!");
      setTimeout(() => setStatus(""), 1500);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setStatus("Error!");
    }
  };

  // 読み込み中はUIのちらつきを防ぐために空のdivを返す
  if (isLoading) {
    return <div className="w-80 h-80 bg-gray-50" />;
  }

  return (
    <div className="w-80 p-6 bg-gray-50 text-gray-800 font-sans">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Notion Words Counter
      </h1>

      <form onSubmit={handleSave} noValidate>
        {/* Count by Section */}
        <div className="mb-5">
          <label className="block text-base font-bold mb-2 text-gray-700">
            Count by:
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="words"
                name="countBy"
                value="words"
                checked={settings.countBy === "words"}
                onChange={handleChange}
                className="h-4 w-4 accent-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="words"
                className="ml-2 block text-sm text-gray-900"
              >
                words
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="characters"
                name="countBy"
                value="characters"
                checked={settings.countBy === "characters"}
                onChange={handleChange}
                className="h-4 w-4 accent-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="characters"
                className="ml-2 block text-sm text-gray-900"
              >
                characters
              </label>
            </div>
          </div>
        </div>

        {/* Enabled Section */}
        <div className="mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={settings.enabled}
              onChange={handleChange}
              className="h-4 w-4 rounded accent-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="enabled"
              className="ml-2 block text-sm font-bold text-gray-900"
            >
              Enabled
            </label>
          </div>
        </div>

        {/* Actions Section */}
        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-2 text-sm font-semibold border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Save
          </button>
          <p className="mt-3 text-sm text-green-600 h-5" aria-live="polite">
            {status}
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;

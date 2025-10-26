import React, { FormEvent, useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "../../src/defaults";
import { Settings } from "../../src/types";

function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // コンポーネントのマウント時に設定を読み込む (async/await形式に修正)
  useEffect(() => {
    const restoreOptions = async () => {
      try {
        // 2. ストレージから設定を読み込む (Promiseベース)
        const items = await chrome.storage.local.get(DEFAULT_SETTINGS);
        setSettings(items as Settings);
      } catch (error) {
        console.error("Failed to restore settings:", error);
      } finally {
        setIsLoading(false); // 読み込み完了
      }
    };

    restoreOptions();
  }, []);

  // フォームの値を汎用的に更新するハンドラ
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
      await chrome.storage.local.set(settings);
      setStatus("Saved!");
      setTimeout(() => setStatus(""), 1500);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setStatus("Error!");
    }
  };

  if (isLoading) {
    return <div className="w-80 h-96 bg-gray-50" />;
  }

  return (
    <div className="w-80 p-6 bg-gray-50 text-gray-800 font-sans">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Notion Words Counter
      </h1>

      <form onSubmit={handleSave} noValidate className="space-y-5">
        {/* Count by Section */}
        <div>
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
                className="h-4 w-4 accent-green-600"
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
                className="h-4 w-4 accent-green-600"
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

        {/* Include Section */}
        <div>
          <label className="block text-base font-bold mb-2 text-gray-700">
            Include:
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includesSpaces"
                name="includesSpaces"
                checked={settings.includesSpaces}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-green-600"
              />
              <label
                htmlFor="includesSpaces"
                className="ml-2 block text-sm text-gray-900"
              >
                spaces
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includesCodeBlocks"
                name="includesCodeBlocks"
                checked={settings.includesCodeBlocks}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-green-600"
              />
              <label
                htmlFor="includesCodeBlocks"
                className="ml-2 block text-sm text-gray-900"
              >
                code blocks
              </label>
            </div>
          </div>
        </div>

        {/* Enabled Section */}
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={settings.enabled}
              onChange={handleChange}
              className="h-4 w-4 rounded accent-green-600"
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
        <div className="text-center pt-3">
          <button
            type="submit"
            className="px-8 py-2 text-sm font-semibold border border-gray-400 rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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

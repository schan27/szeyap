"use client";

import { useState } from "react";
import { Search, Clipboard, Loader2, Edit2, Keyboard } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Input } from "./ui/input";
import DictionarySettings from "./DictionarySettings";
import HandwritingInput from "./HandwritingInput";

const API_URL = "http://szeyap-backend-production.up.railway.app/api/translation";

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [inputMode, setInputMode] = useState("keyboard"); // "keyboard" or "handwriting"
  const [dictionarySettings, setDictionarySettings] = useState({
    script: "traditional", // traditional or simplified
    romanization: "hsr", // hsr, wps, sl, gps, dj
    accent: {
      ing_en: false,
      s_lh: false,
      i_ei: true,
    },
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = new URLSearchParams({
        phrase: searchTerm.trim(),
        dictionary: 'SL_DICT' // Using Stephen Li dictionary as default
      });

      const response = await fetch(`${API_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch translation');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchTerm(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Main Logo */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <img
          src="/hoisan_sauce_logo.webp"
          alt="台山醬 Hoisan Sauce Logo"
          className="h-24 sm:h-32 md:h-36 lg:h-40 object-contain mx-auto mb-4 sm:mb-6"
        />
      </div>

      {/* Search Input */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <div className="relative max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setInputMode("keyboard")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  inputMode === "keyboard"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Keyboard className="w-5 h-5" />
              </button>
              <button
                onClick={() => setInputMode("handwriting")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  inputMode === "handwriting"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {inputMode === "keyboard" ? (
            <div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="INPUT/輸入: 中文/English/penyim"
                className="w-full px-4 h-16 sm:px-6 py-3 sm:py-4 lg:py-5 pr-16 sm:pr-20 text-base sm:text-lg lg:text-xl border-2 border-gray-300 rounded-lg sm:rounded-xl transition-colors"
              />
              <div className="absolute right-2 sm:right-3 top-8 transform -translate-y-1/2 flex space-x-1 sm:space-x-2">
                <Tooltip>
                  <TooltipTrigger
                    onClick={handlePaste}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Paste"
                    aria-label="Paste from clipboard"
                  >
                    <Clipboard size={16} className="sm:w-5 sm:h-5" />
                  </TooltipTrigger>
                  <TooltipContent className="">Paste from clipboard</TooltipContent>
                </Tooltip>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Search"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Search size={16} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <HandwritingInput
                onCharacterRecognized={(character) => {
                  setSearchTerm(prevTerm => prevTerm + character);
                }}
              />
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm}
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear Text
                </button>
              </div>
            </div>
          )}
          <DictionarySettings
            className="mt-4"
            settings={dictionarySettings}
            onSettingsChange={setDictionarySettings}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="text-red-600 text-center mb-4">
            {error}
          </div>
        )}
        {results && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <pre className="whitespace-pre-wrap text-gray-800 text-base">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {/* <div className="text-center sm:text-right">
        <div className="inline-block">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-800 mb-1 sm:mb-2">
            Suggestions?
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600">
            有意見？
          </p>
        </div>
      </div> */}
    </div>
  );
}

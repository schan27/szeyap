"use client";

import { useState, useRef } from "react";
import { Search, Clipboard, Loader2, Edit2, Check, Volume2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Input } from "./ui/input";
import DictionarySettings from "./DictionarySettings";
import DisplayOptions from "./DisplayOptions";
import HandwritingInput from "./HandwritingInput";
import { Checkbox } from "radix-ui";


const API_URL = "https://szeyap-backend-production.up.railway.app/api/translation";
// const API_URL = "http://localhost:8000/api/translation";

export default function SearchSection() {
  const resultsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [inputMode, setInputMode] = useState("keyboard"); // "keyboard" or "handwriting"
  const [searchByPenyim, setSearchByPenyim] = useState(false);
  const [dictionarySettings, setDictionarySettings] = useState({
    dictionary: "ALL_DICT", // ALL_DICT, GC_DICT, SL_DICT or HS_DICT
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

    setInputMode("keyboard");
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = new URLSearchParams({
        phrase: searchTerm.trim(),
        dictionary: dictionarySettings.dictionary,
      });

      if (searchByPenyim) {
        params.append('penyim', 'true');
      }

      const response = await fetch(`${API_URL}?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: window.location.origin,
        },
        mode: "cors",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch translation");
      }

      const data = await response.json();
      console.log("Translation response:", {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      });
      console.log("First translation:", data.translations?.[0]);
      setResults(data);
      setTimeout(() => {
        const offset = 200;
        const elementPosition = resultsRef.current?.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Translation error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-24 xl:px-8 py-8 sm:py-12 lg:py-16">
      {/* Main Logo */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <img
          src="/hoisan_sauce_logo.webp"
          alt="台山醬 Hoisan Sauce Logo"
          className="h-24 sm:h-32 md:h-36 lg:h-40 object-contain mx-auto mb-4 sm:mb-6"
        />
      </div>

      {/* Search Input */}
      <div className="w-5/6 mx-auto flex flex-col gap-2" id="search-section">
        <div className="flex justify-between">

          {/* Handwriting, Clipboard Paste, and Search Buttons */}

          <div className="flex items-center justify-start ml-1">
            <Checkbox.Root
              className="flex size-[1.2rem] appearance-none rounded bg-white shadow-[0_0_0_2px_black] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px_black]"
              id="c1"
              checked={searchByPenyim}
              onCheckedChange={setSearchByPenyim}
            >
              <Checkbox.Indicator>
                <Check className="w-5 h-5 sm:w-5 sm:h-5" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <label
              className="pl-[10px] text-[15px] leading-none"
              htmlFor="c1"
            >Search Penyim</label>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                inputMode === "handwriting"
                  ? setInputMode("keyboard")
                  : setInputMode("handwriting");
              }}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${inputMode === "handwriting"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Edit2 className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
            <Tooltip>
              <TooltipTrigger
                onClick={handlePaste}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                title="Paste"
                aria-label="Paste from clipboard"
              >
                <Clipboard size={16} className="w-5 h-5 sm:w-5 sm:h-5" />
              </TooltipTrigger>
              <TooltipContent className="">Paste from clipboard</TooltipContent>
            </Tooltip>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Search"
            >
              {isLoading ? (
                <Loader2 size={16} className="sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Search size={16} className="w-5 h-5 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="flex gap-0 group">
          <Input
            type="text"
            value={searchTerm}
            onKeyPress={handleKeyPress}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="INPUT/輸入: 中文/English/penyim"
            className="flex-1 px-4 h-16 sm:px-6 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl border-2 border-gray-300 rounded-l-lg rounded-r-none sm:rounded-l-xl border-r-0 transition-colors focus-visible:ring-0 group-focus-within:border-gray-400"
          />
          <DictionarySettings
            settings={dictionarySettings}
            onSettingsChange={setDictionarySettings}
          />
          <div className="absolute right-36 top-8 transform -translate-y-1/2 flex space-x-1 sm:space-x-2 z-10"></div>
        </div>
        {inputMode === "handwriting" && (
          <div className="flex flex-col items-center">
            <HandwritingInput
              onCharacterRecognized={(character) => {
                setSearchTerm((prevTerm) => prevTerm + character);
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
      </div>

      {/* Results Section */}
      <div ref={resultsRef} className="max-w-7xl mt-8">
        <div className="flex flex-col gap-6 items-center">
          {/* Main Results */}
          <div className="w-5/6">
            {error && (
              <div className="text-red-600 text-center mb-4">{error}</div>
            )}
            {results && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  {/* Header with the original word */}
                  <div className="border-b border-gray-200 pb-4 flex justify-between">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-3xl font-medium">
                        {results.original_phrase}
                      </h2>
                      {results.metadata && (
                        <span className="text-sm text-gray-500">
                          From:{" "}
                          <a
                            href={results.metadata.dictionary_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {results.metadata.dictionary_name}
                          </a>
                        </span>
                      )}
                    </div>
                    <DisplayOptions
                      settings={dictionarySettings}
                      onSettingsChange={setDictionarySettings}
                    />
                  </div>

                  {/* Translations */}
                  <div className="space-y-4">
                    {results.translations &&
                      results.translations.map((translation, index) => (
                        <div key={index} className="group">
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-400 font-medium w-6">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <div className="flex flex-col gap-2">
                                {/* Chinese Characters and Pronunciations */}
                                <div className="flex flex-col gap-3">
                                  {/* Character and Romanization */}
                                  <div className="flex flex-col gap-2">
                                    {/* Character */}
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl font-medium">
                                        {translation.chinese?.simplified?.[0] || results.original_phrase}
                                      </span>
                                      {translation.pronunciation_url && (
                                        <button
                                          onClick={() => new Audio(translation.pronunciation_url).play()}
                                          className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                          <Volume2 size={16} className="w-5 h-5 sm:w-5 sm:h-5" />
                                        </button>
                                      )}
                                    </div>

                                    {/* Source */}
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm text-gray-500">
                                        Source: {translation.source}
                                      </span>
                                    </div>

                                    {/* Romanization Systems */}
                                    <div className="flex flex-wrap gap-3">
                                      {translation.chinese?.penyim?.[0] && (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                              WPS
                                            </span>
                                            <span className="text-gray-900">
                                              {
                                                translation.chinese.penyim[0]
                                                  .JW
                                              }
                                            </span>
                                          </div>
                                          <span className="text-gray-300">
                                            ·
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                              SL
                                            </span>
                                            <span className="text-gray-900">
                                              {translation.chinese.penyim[0].SL}
                                            </span>
                                          </div>
                                          <span className="text-gray-300">
                                            ·
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                              GC
                                            </span>
                                            <span className="text-gray-900">
                                              {translation.chinese.penyim[0].GC}
                                            </span>
                                          </div>
                                          <span className="text-gray-300">
                                            ·
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                              HSR
                                            </span>
                                            <span className="text-gray-900">
                                              {translation.chinese.penyim[0].HSR}
                                            </span>
                                          </div>
                                          <span className="text-gray-300">
                                            ·
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                              DJ
                                            </span>
                                            <span className="text-gray-900">
                                              {translation.chinese.penyim[0].DJ}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Definition */}
                                  <p className="text-gray-700">
                                    {translation.english}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

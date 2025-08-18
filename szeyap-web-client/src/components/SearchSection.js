"use client";

import { useState } from "react";
import { Search, Clipboard } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Input } from "./ui/input";
import DictionarySettings from "./DictionarySettings";

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dictionarySettings, setDictionarySettings] = useState({
    script: "traditional", // traditional or simplified
    romanization: "hsr", // hsr, wps, sl, gps, dj
    accent: {
      ing_en: false,
      s_lh: false,
      i_ei: true,
    },
  });

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
          className="h-32 sm:h-40 md:h-48 lg:h-56 object-contain mx-auto mb-4 sm:mb-6"
        />
      </div>

      {/* Search Input */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <div className="relative max-w-3xl mx-auto">
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
                <TooltipTrigger>
                  <button
                    onClick={handlePaste}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Paste"
                    aria-label="Paste from clipboard"
                  >
                    <Clipboard size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="">Paste from clipboard</TooltipContent>
              </Tooltip>
              <button
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Search"
              >
                <Search size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          <DictionarySettings
            className="mt-4"
            settings={dictionarySettings}
            onSettingsChange={setDictionarySettings}
          />
        </div>
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

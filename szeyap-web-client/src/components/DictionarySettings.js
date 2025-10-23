import React from "react";
import { Select, SelectItem } from "@/components/ui/select";

function DictionarySettings({ settings, onSettingsChange }) {
  return (
    <Select
      value={settings.dictionary}
      onValueChange={(value) =>
        onSettingsChange({
          ...settings,
          dictionary: value,
        })
      }
      placeholder="Dictionary"
      className="w-fit min-w-28 h-16 border-2 border-gray-300 border-l-0 rounded-r-lg sm:rounded-r-xl group-focus-within:border-gray-400 transition-colors"
      buttonClassName="rounded-r-lg shadow-none focus:ring-0 hover:bg-accent transition-all group-focus-within:border-gray-400"
      spanClassName="text-[16px] text-base ml-auto"
    >
      <SelectItem className="pr-0.5" value="ALL_DICT">All</SelectItem>
      <SelectItem className="pr-0.5" value="SL_DICT">Stephen Li</SelectItem>
      <SelectItem className="pr-0.5" value="GC_DICT">Gene Chin</SelectItem>
      <SelectItem className="pr-0.5" value="HS_DICT">Hoisan Sauce</SelectItem>
    </Select>
  );
}

export default DictionarySettings;

import React from "react";
import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from "@/components/ui/animated-tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";

function DisplayOptions({ buttonClassName, settings, onSettingsChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`h-8 px-3 py-2 bg-gray-100 text-gray-900 font-normal rounded-md hover:bg-gray-200 transition-color cursor-pointer flex items-center ${buttonClassName}`}>
          Display
          <Settings className="w-4 h-4 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <AnimatedTabs defaultValue="script" className="w-full">
          <AnimatedTabsList className="cursor-pointer w-full grid grid-cols-3">
            <AnimatedTabsTrigger value="script" className="text-sm">
              Script
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="romanization" className="text-sm">
              Penyim
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="accent" className="text-sm">
              Accent
            </AnimatedTabsTrigger>
          </AnimatedTabsList>

          <AnimatedTabsContent
            value="script"
            className="border-2 p-4 rounded-lg bg-sidebar-primary-foreground mt-4"
          >
            <RadioGroup
              value={settings.script}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  script: value,
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="traditional" id="traditional" />
                <Label htmlFor="traditional">Traditional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="simplified" id="simplified" />
                <Label htmlFor="simplified">Simplified</Label>
              </div>
            </RadioGroup>
          </AnimatedTabsContent>

          <AnimatedTabsContent
            value="romanization"
            className="border-2 p-4 rounded-lg bg-sidebar-primary-foreground mt-6"
          >
            <RadioGroup
              value={settings.romanization}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  romanization: value,
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wps" id="wps" />
                <Label htmlFor="wps">WPS (Inspirlang)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sl" id="sl" />
                <Label htmlFor="sl">SL (Stephen Li)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gc" id="gc" />
                <Label htmlFor="gc">GC (Gene Chin)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hsr" id="hsr" />
                <Label htmlFor="hsr">HSR (Hoisan Sauce)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dj" id="dj" />
                <Label htmlFor="dj">DJ (Deng Jun)</Label>
              </div>
            </RadioGroup>
          </AnimatedTabsContent>

          <AnimatedTabsContent
            value="accent"
            className="border-2 p-4 rounded-lg bg-sidebar-primary-foreground flex flex-col gap-2 mt-4"
          >
            <div className="grid grid-cols-3 items-end w-32 gap-2">
              <Label htmlFor="ing_en" className="flex justify-end pr-2">
                ING
              </Label>
              <Switch
                id="ing_en"
                checked={settings.accent.ing_en}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    accent: { ...settings.accent, ing_en: checked },
                  })
                }
              />
              <Label htmlFor="ing_en" className="pl-2">
                EN
              </Label>
            </div>
            <div className="grid grid-cols-3 items-center w-32 gap-2">
              <Label htmlFor="s_lh" className="flex justify-end pr-2.5">
                S
              </Label>
              <Switch
                id="s_lh"
                checked={settings.accent.s_lh}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    accent: { ...settings.accent, s_lh: checked },
                  })
                }
              />
              <Label htmlFor="s_lh" className="pl-2">
                LH
              </Label>
            </div>
            <div className="grid grid-cols-3 items-center w-32 gap-2">
              <Label htmlFor="i_ei" className="flex justify-end pr-3">
                I
              </Label>
              <Switch
                id="i_ei"
                checked={settings.accent.i_ei}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    accent: { ...settings.accent, i_ei: checked },
                  })
                }
              />
              <Label htmlFor="i_ei" className="pl-2">
                EI
              </Label>
            </div>
          </AnimatedTabsContent>
        </AnimatedTabs>
      </PopoverContent>
    </Popover>
  );
}

export default DisplayOptions;

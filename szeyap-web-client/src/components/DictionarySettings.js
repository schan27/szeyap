import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Switch } from "@/components/ui/switch"

function DictionarySettings({ className, settings, onSettingsChange }) {
  return (
    <Tabs defaultValue="account" className={`${className}`}>
      <TabsList className="cursor-pointer">
        <TabsTrigger value="script">Script</TabsTrigger>
        <TabsTrigger value="romanization">Romanization</TabsTrigger>
        <TabsTrigger value="accent">Accent</TabsTrigger>
      </TabsList>
      <TabsContent value="script" className="border-2 p-4 rounded-lg bg-sidebar-primary-foreground">
        <RadioGroup defaultValue="traditional">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="traditional" id="traditional" />
            <Label htmlFor="traditional">Traditional</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simplified" id="simplified" />
            <Label htmlFor="simplified">Simplified</Label>
          </div>
        </RadioGroup>
      </TabsContent>
      <TabsContent value="romanization" className="border-2 p-4 rounded-lg bg-sidebar-primary-foreground">
        <RadioGroup defaultValue="hsr">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hsr" id="hsr" />
            <Label htmlFor="hsr">HSR (Hoisan Sauce Romanization)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wps" id="wps" />
            <Label htmlFor="wps">WPS (Wenzhounese Pinyin System)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sl" id="sl" />
            <Label htmlFor="sl">SL (Stephen Li)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dj" id="dj" />
            <Label htmlFor="dj">DJ (Deng Jun)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="GPS" id="GPS" />
            <Label htmlFor="GPS">GPS (Gene's Phonetic System)</Label>
          </div>
        </RadioGroup>
      </TabsContent>
      <TabsContent value="accent"  className="border-2 p-4 rounded-lg bg-sidebar-primary-foreground flex flex-col gap-2">
        <div className="grid grid-cols-3 items-end w-32 gap-2">
          <Label htmlFor="ing_en" className="flex justify-end pr-2">ING</Label>
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
          <Label htmlFor="ing_en" className="pl-2">EN</Label>
        </div>
        <div className="grid grid-cols-3 items-center w-32 gap-2">
          <Label htmlFor="s_lh" className="flex justify-end pr-2.5">S</Label>
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
          <Label htmlFor="s_lh" className="pl-2">LH</Label>

        </div>
        <div className="grid grid-cols-3 items-center w-32 gap-2">
          <Label htmlFor="i_ei" className="flex justify-end pr-3">I</Label>
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
          <Label htmlFor="i_ei" className="pl-2">EI</Label>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default DictionarySettings;

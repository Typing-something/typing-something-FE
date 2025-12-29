"use client";

import { useState } from "react";
import { type UIMode, UIModePicker } from "../molecules/settingssidebar/UIModePicker";
import { SidebarShell } from "./SidebarShell";
import { useTypingSettings } from "@/stores/useTypingSetting";
import { FontSizeSelector } from "../molecules/settingssidebar/FontSizeSelector";
type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsSidebar({ open, onClose }: Props) {
    const uiMode = useTypingSettings((s) => s.uiMode);
    const setUIMode = useTypingSettings((s) => s.setUIMode);
    const fontSize = useTypingSettings((s) => s.fontSize);
    const setFontSize = useTypingSettings((s) => s.setFontSize); 
    return (
    <SidebarShell
      open={open}
      onClose={onClose}
      widthClassName="w-[320px]"
      header={
        <>
          <h2 className="text-lg font-semibold">Typing Settings</h2>
          <p className="text-sm text-neutral-500">타이핑 스타일을 설정하세요</p>
        </>
      }
    >
      <div className="p-6 space-y-10">
        {/* FONT */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-500">
            FONT
          </h3>

          <div className="grid grid-cols-2 border border-neutral-300">
            <button className="py-3 text-sm bg-white text-black border-r border-neutral-300">
              Serif
            </button>
            <button className="py-3 text-sm bg-black text-white">
              Sans-serif
            </button>
          </div>
        </section>

        {/* FONT SIZE */}
        <FontSizeSelector value={fontSize} onChange={setFontSize}/>

        {/* UI MODE */}
        <UIModePicker value={uiMode} onChange={setUIMode}/>
      </div>
    </SidebarShell>
  );
}
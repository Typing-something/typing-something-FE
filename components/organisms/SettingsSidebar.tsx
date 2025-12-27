"use client";

import { SidebarShell } from "./SidebarShell";
type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsSidebar({ open, onClose }: Props) {
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-neutral-500">
              FONT SIZE
            </h3>
            <span className="text-sm text-neutral-700">md</span>
          </div>

          <div className="grid grid-cols-3 border border-neutral-300">
            <button className="py-3 text-sm border-r border-neutral-300">sm</button>
            <button className="py-3 text-sm bg-black text-white border-r border-neutral-300">
              md
            </button>
            <button className="py-3 text-sm">lg</button>
          </div>
        </section>

        {/* UI MODE */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-500">
            UI MODE
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="radio" checked readOnly className="accent-black" />
              <span className="text-sm">기본</span>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" readOnly className="accent-black" />
              <span className="text-sm">Music Player</span>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" readOnly className="accent-black" />
              <span className="text-sm text-neutral-400">
                Manuscript (원고지)
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" readOnly className="accent-black" />
              <span className="text-sm text-neutral-400">Arcade</span>
            </label>
          </div>
        </section>
      </div>
    </SidebarShell>
  );
}
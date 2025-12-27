"use client";

import { SidebarShell } from "../organisms/SidebarShell";
import { IconButton } from "../atoms/IconButton";

type LyricsItem = {
  id: number;
  title: string;
  singer: string;
};

const MOCK_ITEMS: LyricsItem[] = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  title: "으르렁",
  singer: "엑소",
}));

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LyricsListSidebar({ open, onClose }: Props) {
  return (
    <SidebarShell
      open={open}
      onClose={onClose}
      widthClassName="w-[360px]"
      header={<h2 className="text-lg font-semibold">Current List</h2>}
    >
      <div className="border-t border-neutral-200">
        {MOCK_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center border-b border-neutral-200"
          >
            {/* index */}
            <div className="w-10 shrink-0 flex justify-center text-sm text-neutral-800">
              {idx + 1}
            </div>

            {/* image placeholder */}
            <div className="w-12 h-12 shrink-0 bg-neutral-200 rounded-sm" />

            {/* content */}
            <button
              type="button"
              className="flex-1 text-left px-3 py-5"
            >
              <div className="text-sm font-semibold text-neutral-900">
                {item.title}
              </div>
              <div className="mt-1 text-xs text-neutral-700">
                {item.singer}
              </div>
            </button>

            {/* info */}
            <div className="w-14 shrink-0 flex justify-center">
              <IconButton ariaLabel="정보" variant="ghost">
                <span className="text-lg font-semibold leading-none">i</span>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </SidebarShell>
  );
}
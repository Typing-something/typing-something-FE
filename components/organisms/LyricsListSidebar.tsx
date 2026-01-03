"use client";

import { SidebarShell } from "../organisms/SidebarShell";
import { IconButton } from "../atoms/IconButton";
import { Song } from "@/types/song";
import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
  songs: Song[];
};

export function LyricsListSidebar({ open, onClose, songs }: Props) {
  return (
    <SidebarShell
      open={open}
      onClose={onClose}
      widthClassName="w-[360px]"
      header={<h2 className="text-lg font-semibold">Current List</h2>}
    >
      <div className="border-t border-neutral-200">
        {songs.map((item, idx) => (
          <div
            key={item.songId}
            className="flex items-center border-b border-neutral-200"
          >
            {/* index */}
            <div className="w-10 shrink-0 flex justify-center text-sm text-neutral-800">
              {idx + 1}
            </div>

            {/* image placeholder */}
            <div className="w-12 h-12 shrink-0 relative overflow-hidden rounded-sm bg-neutral-200">
              <Image 
                src={item.imageUrl}
                alt={`${item.title} cover`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            
            {/* content */}
            <button
              type="button"
              className="flex-1 text-left px-3 py-5"
            >
              <div className="text-sm font-semibold text-neutral-900">
                {item.title}
              </div>
              <div className="mt-1 text-xs text-neutral-700">
                {item.artist}
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
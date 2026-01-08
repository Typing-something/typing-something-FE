"use client";

import { IconButton } from "../atoms/IconButton";
import { useSession } from "next-auth/react";
import Image from "next/image";
type Result = { wpm: number; cpm: number; acc: number };
type SongMeta = {
  songId: number;
  imageUrl: string;
  title: string;
  artist: string;
  lyric: string;
};
export function ResultModal({
  open,
  result,
  onClose,
  song,
}: {
  open: boolean;
  result: Result | null;
  onClose: () => void;
  song: SongMeta | null;
}) {
  const { data: session, status } = useSession();
  const me = session?.user;
  const isLoggedIn = status === "authenticated";

  if (!open || !result || !song) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center bg-white text-[#fb4058] border border-[#fb4058] hover:[#fb4058]/90"
        >
          ✕
        </button>

        {/* header */}
        <div className="border-b border-neutral-200 px-6 pb-5 pt-10 text-center">
          <div className="text-xl font-extrabold tracking-tight text-neutral-900">
            LyricType
          </div>
          
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 divide-x divide-neutral-200 border-b border-neutral-200">
          <StatCell label="CPM" value={result.cpm} />
          <StatCell label="WPM" value={result.wpm} />
          <StatCell label="ACC" value={`${result.acc}%`} />
        </div>
        {/* text meta (UI only) */}
        <div className="border-b border-neutral-200 px-6 py-5">
          <div className="flex gap-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={song.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />           
            </div>
            <div>
              <div className="text-base font-semibold text-neutral-900">
                {song.title}
              </div>

              <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                <span>{song.artist}</span>
              </div>
            </div>
          </div>
        
          <div className="mt-3 inline-flex items-center gap-1 rounded border border-neutral-300 px-2 py-0.5 text-xs font-medium text-neutral-600">
            📜 KPOP
          </div>

          <p className="mt-4 text-sm leading-6 text-neutral-700 line-clamp-3">
            {song.lyric}
          </p>

          <div className="mt-4 text-xs text-neutral-400">
            #{song.artist} #KPOP #{song.title}
          </div>
        </div>

        {/* content */}
        <div className="relative px-6 py-6">
          {/* user + like row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* avatar (ui only) */}
              <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200">
                {me?.image ? (
                  <Image
                    src={me.image}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-neutral-900">
                  {isLoggedIn ? (me?.name ?? "Unknown") : "Guest"}
                </div>
                <div className="text-xs text-neutral-500">
                  {isLoggedIn ? (me?.email ?? "Unknown") : ""}
                </div>
              </div>
            </div>

            <IconButton ariaLabel="좋아요" variant="ghost">
              <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
                <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
              </svg>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="px-4 py-5">
      <div className="text-xs font-semibold tracking-widest text-neutral-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-neutral-600">
        {value}
      </div>
    </div>
  );
}
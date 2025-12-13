"use client";

import { ProgressBar } from "../atoms/ProgressBar";
import { StatItem } from "../atoms/StatItem";

type Props = {
  title: string;
  artist: string;
  wpm: number;
  cpm: number;
  acc: number;
  progress: number;
};

export function TypingTopBar({ title, artist, wpm, cpm, acc, progress }: Props) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        {/* 좌: 메타 */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-neutral-200" />
          <div className="leading-tight">
            <div className="text-xs font-semibold text-neutral-900">{title}</div>
            <div className="text-[11px] text-neutral-500">{artist}</div>
          </div>
        </div>

        {/* 우: stats */}
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <StatItem label="WPM" value={wpm} />
          <div className="h-7 w-px bg-neutral-200" />
          <StatItem label="CPM" value={cpm} />
          <div className="h-7 w-px bg-neutral-200" />
          <StatItem label="ACC" value={`${acc}%`} />
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={progress} />
      </div>
    </div>
  );
}
"use client";

import { StatItem } from "../atoms/StatItem";
type Props = {
  wpm: number;
  cpm: number;
  acc: number;
}
export function TypingTopBar({wpm, cpm, acc}: Props) {
  return (
    <div className="flex items-center justify-end bg-neutral-200 border border-neutral-200 rounded-lg px-4 py-3">
      {/* 우: stats*/}
       <div className="flex items-center gap-3 text-xs text-neutral-600">
          <StatItem label="WPM" value={wpm} />
          <div className="h-7 w-px bg-neutral-200" />
          <StatItem label="CPM" value={cpm} />
          <div className="h-7 w-px bg-neutral-200" />
          <StatItem label="ACC" value={`${acc}%`} />
        </div>
    </div>
  );
}

"use client";

import { IconButton } from "../atoms/IconButton";
import { StatItem } from "../atoms/StatItem";
type Props = {
  wpm: number;
  cpm: number;
  acc: number;
  onOpenSettings: () => void;
  onOpenLyricsList: () => void;
}
export function TypingTopBar({wpm, cpm, acc, onOpenSettings, onOpenLyricsList}: Props) {
  return (
    <div className="flex gap-4 items-center justify-end bg-neutral-200 border border-neutral-200 rounded-lg px-4 py-3">
      {/* 우: stats*/}
       <div className="flex items-center gap-3 text-xs text-neutral-600">
          <StatItem label="WPM" value={wpm} />
          <div className="h-7 w-px bg-neutral-200" />
          <StatItem label="CPM" value={cpm} />
          <div className="h-7 w-px bg-neutral-200" />
          <StatItem label="ACC" value={`${acc}%`} />
        </div>
        {/* 설정 */}
      <IconButton ariaLabel="설정" variant="ghost" onClick={onOpenSettings}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
        </svg>
      </IconButton>
      <IconButton ariaLabel="설정" variant="ghost" onClick={onOpenLyricsList}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
        <path fillRule="evenodd" d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z" clipRule="evenodd" />
      </svg>
      </IconButton>
    </div>
  );
}

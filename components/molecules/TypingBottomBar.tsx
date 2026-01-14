"use client";

import { ProgressBar } from "../atoms/ProgressBar";
import { IconButton } from "../atoms/IconButton";
import Image from "next/image";

type Props = {
  title: string;
  artist: string;
  imageUrl: string;
  progress: number;
  isFavorite: boolean;
  onToggleFavorite?: () => void;
};

export function TypingBottomBar({ title, artist, imageUrl, progress, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className="px-4 py-3">
       <div className="mb-3">
        <ProgressBar value={progress} />
      </div>
      <div className="flex items-start justify-between gap-4">
        {/* 좌: 메타 */}
        <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 relative overflow-hidden rounded-md bg-neutral-200">
            <Image
              src={imageUrl}
              alt={`${title} cover`}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-neutral-900">{title}</div>
            <div className="text-[11px] text-neutral-500">{artist}</div>
          </div>
        </div>

        {/* 우: bookmark/like */}
         <div className="flex items-center gap-2">
                {/* <IconButton ariaLabel="찜" variant="ghost">
                  <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </IconButton> */}
        
                <IconButton 
                  ariaLabel="좋아요"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.();
                  }}
                >
                <svg
                  viewBox="0 0 20 20"
                  className={[
                    "size-5 transition-all",
                    isFavorite ? "text-neutral-600" : "text-neutral-400"
                  ].join(" ")}
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke={isFavorite ? "none" : "currentColor"}
                  strokeWidth={1.6}
                >
                    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
                  </svg>
                </IconButton>
          </div>
      </div>
    </div>
  );
}
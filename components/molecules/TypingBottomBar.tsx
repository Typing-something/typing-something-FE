"use client";

import { IconButton } from "../atoms/IconButton";

export function TypingBottomBar() {
  return (
    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
      {/* 좌: 리셋 + prev/next */}
      <div className="flex items-center gap-3">
        <IconButton ariaLabel="처음으로">
          {/* refresh */}
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z" />
          </svg>
        </IconButton>

        <div className="flex items-center gap-2">
          <IconButton ariaLabel="이전">
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </IconButton>

          <IconButton ariaLabel="다음">
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </IconButton>
        </div>
      </div>

      {/* 우: bookmark/like */}
      <div className="flex items-center gap-2">
        <IconButton ariaLabel="찜" variant="ghost">
          <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z"
              clipRule="evenodd"
            />
          </svg>
        </IconButton>

        <IconButton ariaLabel="좋아요" variant="ghost">
          <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
            <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
          </svg>
        </IconButton>
      </div>
    </div>
  );
}
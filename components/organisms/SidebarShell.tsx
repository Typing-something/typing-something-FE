"use client";

import { ReactNode } from "react";
import { IconButton } from "../atoms/IconButton";

type SidebarShellProps = {
  open: boolean;
  onClose: () => void;
  widthClassName?: string; // w-[320px] 같은 거
  header?: ReactNode;      // 상단 영역(제목/서브)
  children: ReactNode;     // 본문
};

export function SidebarShell({
  open,
  onClose,
  widthClassName = "w-[320px]",
  header,
  children,
}: SidebarShellProps) {
  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/10 z-40" />
      )}

      <aside
        className={`
          fixed top-0 right-0 z-50
          h-full ${widthClassName}
          bg-white shadow-xl
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="relative h-full">
          {/* close */}
          <div className="absolute top-4 left-4">
            <IconButton onClick={onClose} ariaLabel="닫기" variant="ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </IconButton>
          </div>

          {/* layout: header fixed + body scroll */}
          <div className="h-full flex flex-col">
            <div className="pt-14 px-6 pb-4 border-b border-neutral-200">
              {header}
            </div>

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
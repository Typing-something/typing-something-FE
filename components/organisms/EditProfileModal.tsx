"use client";

import { useEffect, useRef } from "react";
import EditProfileForm, { type EditProfileSubmitPayload } from "./EditProfileForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  /** 기존 값(초기 프리필) */
  initialName: string;
  initialImageUrl?: string | null;

  /** 저장 핸들러(서버 호출은 부모에서) */
  onSubmit: (payload: EditProfileSubmitPayload) => Promise<void> | void;

  title?: string;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  initialName,
  initialImageUrl,
  onSubmit,
  title = "프로필 편집",
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // ESC 닫기 + 열릴 때 포커스
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    // 열릴 때 모달에 포커스
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    // 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div aria-hidden={!isOpen} className="fixed inset-0 z-50">
      {/* 전체 화면 클릭 감지 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center px-4"
        onMouseDown={(e) => {
          // 패널 바깥(배경) 클릭만 닫기
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* 패널 내부 클릭은 닫히지 않도록 */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full max-w-[560px] border border-neutral-200 bg-white shadow-xl outline-none"
        >
          {/* header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <div className="text-sm font-semibold text-neutral-900">{title}</div>
  
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center border border-[#fb4058] bg-white text-[#fb4058] hover:bg-[#fb4058]/4"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
  
          <div className="px-6 py-5">
            <EditProfileForm
              initialName={initialName}
              initialImageUrl={initialImageUrl}
              onCancel={onClose}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
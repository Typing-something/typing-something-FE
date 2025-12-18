"use client";

import { forwardRef } from "react";

type TypingInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
};

export const TypingInput = forwardRef<HTMLInputElement, TypingInputProps>(
  ({ value, onChange, onCompositionStart, onCompositionEnd }, ref) => {
    return (
      <input
        ref={ref}
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        // 화면에는 안 보이지만, 포커스는 받을 수 있게
        className="absolute left-0 top-0 w-px h-px opacity-0 pointer-events-none"
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
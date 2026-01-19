"use client";

import { forwardRef } from "react";

type TypingInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  isComposing?: boolean;
};

export const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(
  ({ value, onChange, onCompositionStart, onCompositionEnd, isComposing }, ref) => {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (isComposing) return;
          e.preventDefault();
          onChange(value + "\n");
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        className="
          absolute inset-0
          w-full h-full
          opacity-0
          resize-none
          outline-none
          bg-transparent
        "
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
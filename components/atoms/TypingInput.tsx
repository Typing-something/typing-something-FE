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
        // autoFocus
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
        className="absolute left-0 top-0 w-px h-px opacity-0 pointer-events-none resize-none"
      />
    );
  }
);

TypingInput.displayName = "TypingInput";
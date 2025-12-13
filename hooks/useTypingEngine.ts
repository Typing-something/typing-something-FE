"use client";

import { useCallback, useMemo, useRef, useState } from "react";

type UseTypingEngineOptions = {
  /** input을 원문 길이까지만 받도록 제한 (기본 false) */
  clampToTextLength?: boolean;
};

export type TypingEngine = {
  // data
  text: string;
  input: string;
  cursorIndex: number;
  progress: number; // 0~100

  // refs
  inputRef: React.RefObject<HTMLInputElement | null>;

  // actions
  setInput: (value: string) => void;
  focus: () => void;
  reset: () => void;

  // helpers (나중에 stats 붙일 때 유용)
  typedLength: number;
};

export function useTypingEngine(text: string, options: UseTypingEngineOptions = {}): TypingEngine {
  const { clampToTextLength = false } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, _setInput] = useState("");

  const safeText = text ?? "";

  const setInput = useCallback(
    (value: string) => {
      if (!clampToTextLength) {
        _setInput(value);
        return;
      }
      // 원문 길이 이상 입력을 막고 싶을 때(옵션)
      _setInput(value.slice(0, safeText.length));
    },
    [clampToTextLength, safeText.length]
  );

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const reset = useCallback(() => {
    _setInput("");
    // UX: reset하면 다시 타이핑 바로 가능하게 포커스 유지
    inputRef.current?.focus();
  }, []);

  const typedLength = input.length;

  const cursorIndex = useMemo(() => {
    // 커서 = 현재 입력 길이 (원문보다 길어질 때는 끝에 고정)
    return Math.min(typedLength, safeText.length);
  }, [typedLength, safeText.length]);

  const progress = useMemo(() => {
    if (safeText.length === 0) return 0;
    const pct = Math.round((typedLength / safeText.length) * 100);
    return Math.min(pct, 100);
  }, [typedLength, safeText.length]);

  return {
    text: safeText,
    input,
    cursorIndex,
    progress,
    inputRef,
    setInput,
    focus,
    reset,
    typedLength,
  };
}
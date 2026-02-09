"use client";

import { RefObject } from "react";
import { TypingDisplay } from "./TypingDisplay";
import { TypingInput } from "../atoms/TypingInput";
import { splitLines, normalizeInputLines } from "@/utils/typingLine";

type Props = {
  text: string;
  input: string;
  cursorIndex: number;
  onFocusRequest: () => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onChangeInput: (v: string) => void;
  isComposing: boolean;
  onComposingChange: (v: boolean) => void;
};

export function TypingStage({
  text,
  input,
  cursorIndex,
  onFocusRequest,
  inputRef,
  onChangeInput,
  isComposing,
  onComposingChange,
}: Props) {
  const lines = splitLines(text);

  return (
      <div
        className="relative px-6 py-8 cursor-text"
        onClick={onFocusRequest}
      >
        {/* 🎵 가사 뷰포트 */}
        <div
          className="relative overflow-hidden h-[170px] py-[30px] bg-neutral-100"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        >          
          <TypingDisplay
            lines={lines}
            input={input}
            cursorIndex={cursorIndex}
            isComposing={isComposing}
          />
        </div>

        {/* ⌨️ 투명 입력 레이어 */}
        <TypingInput
          ref={inputRef}
          value={input}
          onChange={(v) => onChangeInput(normalizeInputLines(lines, v, 5))}
          onCompositionStart={() => onComposingChange(true)}
          onCompositionEnd={() => onComposingChange(false)}
          isComposing={isComposing}
        />
      </div>  
    );
}


"use client";

import { RefObject } from "react";
import { TypingDisplay } from "./TypingDisplay";
import { TypingInput } from "../atoms/TypingInput";
import { useState } from "react";
type Props = {
  text: string;
  input: string;
  cursorIndex: number;
  onFocusRequest: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
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
  // const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="relative px-6 py-8 space-y-4 cursor-text" onClick={onFocusRequest}>
      <TypingDisplay 
        text={text}
        input={input}
        cursorIndex={cursorIndex} 
        isComposing={isComposing}
        />
        <TypingInput
          ref={inputRef}
          value={input}
          onChange={(v) => onChangeInput(normalizeInput(text, v, 5))}
          onCompositionStart={() => onComposingChange(true)}
          onCompositionEnd={() => onComposingChange(false)}
        />
    </div>
  );
}
function normalizeInput(text: string, rawInput: string, maxExtra = 5) {
  let i = 0; // text index
  let out = "";

  const findNextSpace = (from: number) => {
    const idx = text.indexOf(" ", from);
    return idx === -1 ? text.length : idx;
  };

  // space별 extra 길이 추적
  const extraCountBySpace: Record<number, number> = {};

  for (let k = 0; k < rawInput.length; k++) {
    const u = rawInput[k];
    if (i >= text.length) break;

    const t = text[i];

    // text가 space인 자리
    if (t === " ") {
      if (u === " ") {
        out += u;
        i++;
      } else {
        // extra는 space칸에 쓰지 않고, space에 머무른 채로 앞에 표시될 후보
        const cnt = extraCountBySpace[i] ?? 0;
        if (cnt < maxExtra) {
          out += u;                 // ✅ 허용
          extraCountBySpace[i] = cnt + 1;
        } else {
          // ✅ 초과분은 "입력 자체를 무시" (out에 넣지 않음)
        }
      }
      continue;
    }

    // text가 일반 글자인 자리인데 user가 space를 누름(규칙 3)
    if (u === " ") {
      const nextSpace = findNextSpace(i);
      // 스페이스 입력은 nextSpace의 space와 매칭시키기 위해 text 인덱스 점프
      if (nextSpace < text.length && text[nextSpace] === " ") {
        out += u;
        i = nextSpace + 1;
      } else {
        // 더 이상 space가 없으면 그냥 소비만
        out += u;
        i = nextSpace;
      }
      continue;
    }

    // 일반 매칭
    out += u;
    i++;
  }

  return out;
}
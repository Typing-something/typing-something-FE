"use client";

import { RefObject } from "react";
import { TypingDisplay } from "./TypingDisplay";
import { TypingInput } from "../atoms/TypingInput";

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

function splitLines(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function normalizeInputLines(lines: string[], rawInput: string, maxExtra = 5) {
  let line = 0;
  let col = 0;
  let out = "";
  const extraCountBySpace: Record<string, number> = {};

  const curLineText = () => lines[line] ?? "";

  for (let k = 0; k < rawInput.length; k++) {
    const u = rawInput[k];

    // 핵심: 입력에 이미 들어온 '\n'은 무조건 다음 줄로 이동
    if (u === "\n") {
      out += "\n";
      line++;
      col = 0;
      continue;
    }

    if (line >= lines.length) break;

    const textLine = curLineText();

    // 라인 끝에서 Space 누르면 다음 줄로(=Space=Enter)
    if (col >= textLine.length) {
      if (u === " ") {
        out += "\n";
        line++;
        col = 0;
      }
      continue;
    }

    const t = textLine[col];

    // 타겟이 space인 자리(extra 정책)
    if (t === " ") {
      if (u === " ") {
        out += " ";
        col++;
      } else {
        const key = `${line}:${col}`;
        const cnt = extraCountBySpace[key] ?? 0;
        if (cnt < maxExtra) {
          out += u;
          extraCountBySpace[key] = cnt + 1;
        }
      }
      continue;
    }

    // user가 space: 같은 줄에서만 다음 space(또는 라인 끝)로 스킵
    if (u === " ") {
      const nextSpace = textLine.indexOf(" ", col);
      out += " ";
      col = nextSpace === -1 ? textLine.length : nextSpace + 1;
      continue;
    }

    // 일반 문자
    out += u;
    col++;
  }

  return out;
}
"use client";

import { useTypingSettings } from "@/stores/useTypingSetting";

type TypingDisplayProps = {
  text: string;
  input: string;
  cursorIndex: number;
  isComposing: boolean;
};

type CellState = "correct" | "wrong" | "untyped" | "skipped";
type ExtraPos = { spaceIndex: number; offset: number };

type Parsed = {
  states: CellState[];
  typedAt: (string | null)[];
  extrasBeforeSpace: Record<number, string>;
  cursorIndex: number;

  inputToText: number[];
  inputToExtra: (ExtraPos | null)[];
};

function parseTyping(text: string, input: string, maxExtra = 5): Parsed {
  const n = text.length;
  const states: CellState[] = Array(n).fill("untyped");
  const typedAt: (string | null)[] = Array(n).fill(null);
  const extrasBeforeSpace: Record<number, string> = {};

  const inputToText: number[] = Array(input.length).fill(-1);
  const inputToExtra: (ExtraPos | null)[] = Array(input.length).fill(null);

  let i = 0;
  let j = 0;

  const findNextSpace = (from: number) => {
    const idx = text.indexOf(" ", from);
    return idx === -1 ? n : idx;
  };

  while (i < n && j < input.length) {
    const t = text[i];
    const u = input[j];

    if (t === "\n") {
      states[i] = "correct";
      typedAt[i] = null;
      i++;
      continue;
    }
  

    if (t === " ") {
      if (u === " ") {
        states[i] = "correct";
        inputToText[j] = i;
        inputToExtra[j] = null;
        i++;
        j++;
      } else {
        const prev = extrasBeforeSpace[i] ?? "";
        if (prev.length < maxExtra) {
          extrasBeforeSpace[i] = prev + u;
          inputToText[j] = -1;
          inputToExtra[j] = { spaceIndex: i, offset: prev.length };
        } else {
          inputToText[j] = -1;
          inputToExtra[j] = null;
        }
        j++;
      }
      continue;
    }

    if (u === " ") {
      const nextSpace = findNextSpace(i);

      for (let k = i; k < nextSpace; k++) {
        if (states[k] === "untyped") states[k] = "skipped";
      }

      if (nextSpace < n && text[nextSpace] === " ") {
        states[nextSpace] = "correct";
        inputToText[j] = nextSpace;
        inputToExtra[j] = null;

        i = nextSpace + 1;
        j++;
      } else {
        inputToText[j] = -1;
        inputToExtra[j] = null;
        j++;
        i = nextSpace;
      }
      continue;
    }

    typedAt[i] = u;
    states[i] = u === t ? "correct" : "wrong";
    inputToText[j] = i;
    inputToExtra[j] = null;

    i++;
    j++;
  }

  return {
    states,
    typedAt,
    extrasBeforeSpace,
    cursorIndex: i,
    inputToText,
    inputToExtra,
  };
}
function normalizeLyric(raw: string) {
  return raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
export function TypingDisplay({
  text,
  input,
  cursorIndex,
  isComposing,
}: TypingDisplayProps) {
  const uiMode = useTypingSettings((s) => s.uiMode);
  const isManuscript = uiMode === "manuscript";
  
  const fontSize = useTypingSettings((s) => s.fontSize);
  const fontSizeClass =
  fontSize === "sm"
    ? "text-[16px] leading-[26px]"
    : fontSize === "lg"
    ? "text-[24px] leading-[36px]"
    : "text-[20px] leading-[30px]"; // md (default)
  
    const safeText = normalizeLyric(text ?? ""); 
    const parsed = parseTyping(safeText, input, 5);
  const effectiveCursor = parsed.cursorIndex;

  const composingInputIndex = isComposing ? input.length - 1 : -1;
  const composingTextIndex =
    composingInputIndex >= 0 ? parsed.inputToText[composingInputIndex] : -2;
  const composingExtraPos =
    composingInputIndex >= 0 ? parsed.inputToExtra[composingInputIndex] : null;

  return (
    <div
      className={[
        "flex flex-wrap",
        fontSizeClass,
        isManuscript ? "" : "gap-[2px]", // ✅ 원고지 모드에서는 gap 제거(칸이 간격 역할)
      ].join(" ")}
    >
      {safeText.split("").map((char, index) => {
        if (char === "\n") {
          return <span key={index} className="w-full block h-4" />;
        }
        const state = parsed.states[index];
        const typed = parsed.typedAt[index];
        const extra = parsed.extrasBeforeSpace[index];

        const isCursorHere = index === effectiveCursor;

        const displayChar = state === "wrong" && typed != null ? typed : char;

        let color = "text-neutral-400";
        if (state === "correct") color = "text-neutral-900";
        if (state === "wrong") color = "text-[#fb4058]";

        if (isComposing && index === composingTextIndex) {
          color = "text-neutral-900";
        }

        // ✅ "셀" 클래스(원고지 모드일 때만)
        const cellClass = isManuscript ? "manuscript-cell-inline" : "";

        return (
          <span key={index} className={isManuscript ? cellClass : ""}>
            {/* ✅ 원고지 모드에선 커서(막대) 안 그리기: 칸 테두리로 충분함 */}
            {!isManuscript && isCursorHere && (
              <span className="inline-block w-[2px] h-[1.45em] bg-[#fb4058] align-middle typing-cursor mr-[1px]" />
            )}

            {/* space 자리 extra 렌더(원래 로직 유지) */}
            {char === " " && extra && (
              <span>
                {extra.split("").map((c, ei) => {
                  const isComposingExtraHere =
                    isComposing &&
                    composingExtraPos?.spaceIndex === index &&
                    composingExtraPos?.offset === ei;

                  return (
                    <span
                      key={ei}
                      className={isComposingExtraHere ? "text-neutral-900" : "text-[#fb4058]"}
                    >
                      {c}
                    </span>
                  );
                })}
              </span>
            )}

            {/* ✅ 글자 자체: 원고지 모드면 칸 안 가운데 정렬 */}
            <span className={[color, isManuscript ? "manuscript-char" : ""].join(" ")}>
              {char === " " ? "\u00A0" : displayChar}
            </span>

            {/* ✅ 원고지 모드 커서: 현재 칸을 강조 */}
            {isManuscript && isCursorHere && <span className="manuscript-caret" />}
          </span>
        );
      })}

      {!isManuscript && effectiveCursor === safeText.length && (
        <span className="inline-block w-[2px] h-[1.45em] bg-[#fb4058] align-middle typing-cursor ml-[1px]" />
      )}
    </div>
  );
}
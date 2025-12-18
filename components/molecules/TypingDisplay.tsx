"use client";

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

  // 핵심: input index가 실제로 어디에 렌더됐는지 매핑
  inputToText: number[]; // inputIndex -> textIndex (없으면 -1)
  inputToExtra: (ExtraPos | null)[]; // inputIndex -> extra 위치
};

function parseTyping(text: string, input: string, maxExtra = 5): Parsed {
  const n = text.length;
  const states: CellState[] = Array(n).fill("untyped");
  const typedAt: (string | null)[] = Array(n).fill(null);
  const extrasBeforeSpace: Record<number, string> = {};

  const inputToText: number[] = Array(input.length).fill(-1);
  const inputToExtra: (ExtraPos | null)[] = Array(input.length).fill(null);

  let i = 0; // text index
  let j = 0; // input index

  const findNextSpace = (from: number) => {
    const idx = text.indexOf(" ", from);
    return idx === -1 ? n : idx;
  };

  while (i < n && j < input.length) {
    const t = text[i];
    const u = input[j];

    // text가 space인 자리
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
          // normalizeInput에서 막히는 게 정석. 혹시 들어오면 그냥 소비
          inputToText[j] = -1;
          inputToExtra[j] = null;
        }
        j++; // text는 space에 그대로
      }
      continue;
    }

    // text가 일반 글자, user가 space (규칙3)
    if (u === " ") {
      const nextSpace = findNextSpace(i);

      for (let k = i; k < nextSpace; k++) {
        if (states[k] === "untyped") states[k] = "skipped";
      }

      if (nextSpace < n && text[nextSpace] === " ") {
        states[nextSpace] = "correct";
        inputToText[j] = nextSpace; // 이 space는 nextSpace에 매핑
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

    // 일반 매칭
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

export function TypingDisplay({ text, input, cursorIndex, isComposing }: TypingDisplayProps) {
  const safeText = text ?? "";
  const parsed = parseTyping(safeText, input, 5);
  const effectiveCursor = parsed.cursorIndex;

  // 조합 중인 "마지막 input 글자"가 어디에 그려지는지
  const composingInputIndex = isComposing ? input.length - 1 : -1;
  const composingTextIndex =
    composingInputIndex >= 0 ? parsed.inputToText[composingInputIndex] : -2;
  const composingExtraPos =
    composingInputIndex >= 0 ? parsed.inputToExtra[composingInputIndex] : null;

  return (
    <div className="flex flex-wrap gap-[2px] text-lg leading-7">
      {safeText.split("").map((char, index) => {
        const state = parsed.states[index];
        const typed = parsed.typedAt[index];
        const extra = parsed.extrasBeforeSpace[index];

        const isCursorHere = index === effectiveCursor;

        const displayChar = state === "wrong" && typed != null ? typed : char;

        let color = "text-neutral-400";
        if (state === "correct") color = "text-neutral-900";
        if (state === "wrong") color = "text-red-500";

        // 조합 중인 “진짜 그 칸”이면 빨강 금지
        if (isComposing && index === composingTextIndex) {
          color = "text-neutral-900";
        }

        return (
          <span key={index}>
            {isCursorHere && (
              <span className="inline-block w-[2px] h-[1.3em] bg-blue-500 align-middle animate-pulse mr-[1px]" />
            )}

            {/* space 자리의 extra를 글자 단위로 렌더(조합중 1글자만 검정) */}
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
                      className={isComposingExtraHere ? "text-neutral-900" : "text-red-500"}
                    >
                      {c}
                    </span>
                  );
                })}
              </span>
            )}

            <span className={color}>{char === " " ? "\u00A0" : displayChar}</span>
          </span>
        );
      })}

      {effectiveCursor === safeText.length && (
        <span className="inline-block w-[2px] h-[1.3em] bg-blue-500 align-middle animate-pulse ml-[1px]" />
      )}
    </div>
  );
}
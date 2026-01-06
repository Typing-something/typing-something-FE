"use client";

import { useTypingSettings } from "@/stores/useTypingSetting";
import { parseTypingLine } from "@/utils/parseTypingLine";
type TypingDisplayProps = {
  lines: string[]; // ✅ text → lines
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


export function TypingDisplay({
  lines,
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
      : "text-[20px] leading-[30px]";

  const inputLines = input.split("\n");
  const activeLine = Math.min(inputLines.length - 1, lines.length - 1);

  return (
    <div className={["flex flex-col", fontSizeClass, "gap-[6px]"].join(" ")}>
      {lines.map((line, lineIdx) => {
        const parsed = parseTypingLine(line, inputLines[lineIdx] ?? "", 5);
        const effectiveCursor = parsed.cursorIndex;
        const composingInputIndex = isComposing
          ? (inputLines[lineIdx] ?? "").length - 1
          : -1;
        const composingTextIndex =
          composingInputIndex >= 0
            ? parsed.inputToText[composingInputIndex]
            : -2;
        const composingExtraPos =
          composingInputIndex >= 0
            ? parsed.inputToExtra[composingInputIndex]
            : null;

        return (
          <div
            key={lineIdx}
            className={[
              "flex flex-wrap",
              isManuscript ? "" : "gap-[2px]",
            ].join(" ")}
          >
            {line.split("").map((char, index) => {
              const state = parsed.states[index];
              const typed = parsed.typedAt[index];
              const extra = parsed.extrasBeforeSpace[index];
              const isCursorHere = lineIdx === activeLine && index === effectiveCursor;              const displayChar =
                state === "wrong" && typed != null ? typed : char;

              let color = "text-neutral-400";
              if (state === "correct") color = "text-neutral-900";
              if (state === "wrong") color = "text-[#fb4058]";
              if (isComposing && index === composingTextIndex)
                color = "text-neutral-900";

              const cellClass = isManuscript ? "manuscript-cell-inline" : "";

              return (
                <span key={index} className={isManuscript ? cellClass : ""}>
                  {!isManuscript && isCursorHere && (
                    <span className="inline-block w-[2px] h-[1.45em] bg-[#fb4058] align-middle typing-cursor mr-[1px]" />
                  )}
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
                            className={
                              isComposingExtraHere
                                ? "text-neutral-900"
                                : "text-[#fb4058]"
                            }
                          >
                            {c}
                          </span>
                        );
                      })}
                    </span>
                  )}
                  <span
                    className={[
                      color,
                      isManuscript ? "manuscript-char" : "",
                    ].join(" ")}
                  >
                    {char === " " ? "\u00A0" : displayChar}
                  </span>
                  {isManuscript && isCursorHere && (
                    <span className="manuscript-caret" />
                  )}
                </span>
              );
            })}
            {!isManuscript &&
              lineIdx === activeLine &&
              effectiveCursor === line.length && (
                <span className="inline-block w-[2px] h-[1.45em] bg-[#fb4058] align-middle typing-cursor ml-[1px]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
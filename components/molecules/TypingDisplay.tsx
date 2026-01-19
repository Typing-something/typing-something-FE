"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTypingSettings } from "@/stores/useTypingSetting";
import { parseTypingLine } from "@/utils/parseTypingLine";

type TypingDisplayProps = {
  lines: string[];
  input: string;
  cursorIndex: number;
  isComposing: boolean;
};

export function TypingDisplay({ lines, input, cursorIndex, isComposing }: TypingDisplayProps) {
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

  /** ✅ 4줄 이상일 때만 “가사앱 센터링” 모드 */
  const enableCentering = lines.length >= 4;

  /** ✅ 뷰포트(부모 div: h-[] + overflow-hidden) 기준 측정 */
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [offsetY, setOffsetY] = useState(0);
  
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    const target = lineRefs.current[activeLine];
    if (!viewport || !list || !target) return;
  
    // ✅ “현재 줄이 뷰포트 중앙”이 되도록 필요한 스크롤량(절대값)
    const viewportCenter = viewport.clientHeight / 2;
    const lineCenter = target.offsetTop + target.offsetHeight / 2;
    const desired = lineCenter - viewportCenter; // 0이면 딱 중앙
  
    const max = Math.max(0, list.scrollHeight - viewport.clientHeight);

    // ✅ viewport의 padding-top/bottom 만큼은 위/아래로 더 움직여도 OK
    const padTop = 30;    // TypingStage의 py-[30px]랑 맞추기
    const padBottom = 30;
    
    const min = -padTop;
    const maxWithPad = max + padBottom;
    
    setOffsetY(Math.min(Math.max(desired, min), maxWithPad));
  }, [activeLine, lines.length, fontSize]); // fontSize 바뀌면 재계산

  return (
    <div ref={viewportRef} className={["h-full", fontSizeClass].join(" ")}>
        <div
          ref={listRef}
          className="flex flex-col gap-[4px] will-change-transform transition-transform duration-250 ease-out"
          style={{ transform: `translateY(${-offsetY}px)` }}
        >
        {lines.map((line, lineIdx) => {
          const parsed = parseTypingLine(line, inputLines[lineIdx] ?? "", 5);
          const effectiveCursor = parsed.cursorIndex;

          const composingInputIndex = isComposing ? (inputLines[lineIdx] ?? "").length - 1 : -1;
          const composingTextIndex =
            composingInputIndex >= 0 ? parsed.inputToText[composingInputIndex] : -2;
          const composingExtraPos =
            composingInputIndex >= 0 ? parsed.inputToExtra[composingInputIndex] : null;

          const isActive = lineIdx === activeLine;
          const isPast = lineIdx < activeLine;
          const isFuture = lineIdx > activeLine;

          const lineStyle = isActive
            ? "opacity-100"
            : isPast
            ? "opacity-70 blur-[0.2px]"
            : "opacity-60 blur-[0.2px]";
            
          return (
            <div
              key={lineIdx}
              ref={(el) => {
                lineRefs.current[lineIdx] = el;
              }}
              className={[
                "flex flex-wrap",
                isManuscript ? "" : "gap-[2px]",
                lineStyle
              ].join(" ")}
            >
              {line.split("").map((char, index) => {
                const state = parsed.states[index];
                const typed = parsed.typedAt[index];
                const extra = parsed.extrasBeforeSpace[index];

                const isCursorHere = lineIdx === activeLine && index === effectiveCursor;

                const displayChar = state === "wrong" && typed != null ? typed : char;

                let color = "text-neutral-400";
                if (state === "correct") color = "text-neutral-900";
                if (state === "wrong") color = "text-[#fb4058]";
                if (isComposing && index === composingTextIndex) color = "text-neutral-900";

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
                              className={isComposingExtraHere ? "text-neutral-900" : "text-[#fb4058]"}
                            >
                              {c}
                            </span>
                          );
                        })}
                      </span>
                    )}

                    <span className={[color, isManuscript ? "manuscript-char" : ""].join(" ")}>
                      {char === " " ? "\u00A0" : displayChar}
                    </span>

                    {isManuscript && isCursorHere && <span className="manuscript-caret" />}
                  </span>
                );
              })}

              {!isManuscript && lineIdx === activeLine && effectiveCursor === line.length && (
                <span className="inline-block w-[2px] h-[1.45em] bg-[#fb4058] align-middle typing-cursor ml-[1px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
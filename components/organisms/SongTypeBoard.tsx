"use client";

import type { Song } from "@/app/page";
import { TypingDisplay } from "../molecules/TypingDisplay";
import { useState, useRef } from "react";
import { TypingInput } from "../atoms/TypingInput";
import { TypingBottomBar } from "../molecules/TypingBottomBar";
import { TypingStage } from "../molecules/TypingStage";
import { TypingTopBar } from "../molecules/TypingTopBar";

type Props = {
  song: {
    songId: number;
    title: string;
    artist: string;
    lyrice: string;
  };
};

export function SongTypeBoard({ song }: Props) {
  const [input, setInput] = useState("");
  const text = song?.lyrice ?? "가사가 없습니다(디버깅용)";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusInput = () => inputRef.current?.focus();

  const progress = Math.min(Math.round((input.length / text.length) * 100), 100);
  const cursorIndex = Math.min(input.length, text.length);

  // ✅ UI만 먼저: 더미 값
  const wpm = 72;
  const cpm = 360;
  const acc = 98;

  return (
    <div className="w-full max-w-4xl rounded-xl border border-neutral-300 bg-white shadow-lg">
      {/* =======================
          상단: 타이틀 + Stats + Progress
         ======================= */}
      <TypingTopBar 
        title={song.title}
        artist={song.artist}
        wpm={wpm}
        cpm={cpm}
        acc={acc}
        progress={progress}
      />
      {/* =======================
          중앙: 타이핑 영역
         ======================= */}
        <TypingStage
          text={text}
          input={input}
          cursorIndex={cursorIndex}
          onFocusRequest={focusInput}
          inputRef={inputRef}
          onChangeInput={setInput}
        />     
         {/* =======================
          하단: 메타정보(이미지) + 버튼들
         ======================= */}
        <TypingBottomBar />
    </div>
  );
}
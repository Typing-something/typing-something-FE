"use client";

import { useState, useRef, useEffect } from "react";
import { TypingBottomBar } from "../molecules/TypingBottomBar";
import { TypingStage } from "../molecules/TypingStage";
import { TypingTopBar } from "../molecules/TypingTopBar";
import { useLiveTypingMetrics } from "@/hooks/useLiveTypingMetrics";
import { ResultModal } from "../molecules/ResultModal";
import TypingControlBar from "../molecules/TypingControlBar";
type Props = {
  song: {
    songId: number;
    title: string;
    artist: string;
    lyrice: string;
  };
};

type Result = { wpm: number; cpm: number; acc: number };

export function SongTypeBoard({ song }: Props) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const text = song?.lyrice ?? "가사가 없습니다(디버깅용)";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusInput = () => inputRef.current?.focus();

  const progress = Math.min(Math.round((input.length / text.length) * 100), 100);
  const cursorIndex = Math.min(input.length, text.length);

  const {metrics, resetMetrics} = useLiveTypingMetrics(text, input, isComposing);

  const wpm = metrics.wpm;
  const cpm = metrics.cpm;
  const acc = metrics.acc;

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const isFinished = input.length >= text.length; // normalize 정책이면 필요시 더 엄격히

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (isComposing) return;
      if (!isFinished) return;
  
      e.preventDefault();
  
      setResult({ wpm: metrics.wpm, cpm: metrics.cpm, acc: metrics.acc });
      setIsResultOpen(true);
    };
  
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isComposing, isFinished, metrics.wpm, metrics.cpm, metrics.acc]);
 
  return (
    <div className="w-full max-w-4xl ">
      {/* =======================
          상단: 타이틀 + Stats + Progress
         ======================= */}
      <div className="mb-16">
        <TypingTopBar wpm={wpm} cpm={cpm} acc={acc}/>
      </div>
       <div className="space-y-6">
        <div className="space-y-6">
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
              isComposing={isComposing}
              onComposingChange={setIsComposing}
            />     
            {/* =======================
              중앙 : 컨트롤 바
            ======================= */}
            <TypingControlBar />
        </div>
         {/* =======================
          하단: 메타정보(이미지) + 버튼들
         ======================= */}
         <div className="pt-6">
          <TypingBottomBar 
              title={song.title}
              artist={song.artist}
              wpm={wpm}
              cpm={cpm}
              acc={acc}
              progress={progress}
            />
         </div>
       </div>
        
         {/* =======================
           결과 모달
         ======================= */}
        <ResultModal
          open={isResultOpen}
          result={result}
          onClose={() => setIsResultOpen(false)}
        />
        </div>
  );
}
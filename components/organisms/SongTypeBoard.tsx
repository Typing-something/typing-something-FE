"use client";

import { useState, useRef, useEffect } from "react";
import { TypingBottomBar } from "../molecules/TypingBottomBar";
import { TypingStage } from "../molecules/TypingStage";
import { TypingTopBar } from "../molecules/TypingTopBar";
import { useLiveTypingMetrics } from "@/hooks/useLiveTypingMetrics";
import { ResultModal } from "../molecules/ResultModal";
import TypingControlBar from "../molecules/TypingControlBar";
import { SettingsSidebar } from "./SettingsSidebar";
import { LyricsListSidebar } from "./LyricsListSidebar";
import { Song } from "@/types/song";
type Props = {
  songs: Song[];
}

type Result = { wpm: number; cpm: number; acc: number };

export function SongTypeBoard({ songs }: Props) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLyricsListOpen, setIsLyricsListOpen] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const song = songs[songIndex];
  const text = song?.lyric ?? "가사가 없습니다(디버깅용)";

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

  /// 컨트롤바로 조작 로직
  const canNext = songIndex < songs.length - 1;

  const resetForSong = () => {
    setInput("");
    setIsComposing(false);
    setIsResultOpen(false);
    setResult(null);
    resetMetrics();
    focusInput();
  };

  const goNextSong = () => {
    if (!canNext) return;
    setSongIndex((i) => i + 1);
  };
  /// 컨트롤바로 조작 로직 end

  useEffect(() => {
    resetForSong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songIndex]);

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
 
  if(!songs || songs.length === 0) {
    return <div className="w-full max-w-4xl">곡이 없습니다.</div>
  }
  return (
    <div className="w-full max-w-4xl ">
      {/* =======================
          상단: 타이틀 + Stats + Progress
         ======================= */}
      <div className="mb-16">
        <TypingTopBar 
          wpm={wpm} 
          cpm={cpm} 
          acc={acc}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLyricsList={() => setIsLyricsListOpen(true)}
        />
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
            <TypingControlBar
              onReset={resetForSong}
              onNext={goNextSong}
              disableNext={!canNext}
            />       
         </div>
         {/* =======================
          하단: 메타정보(이미지) + 버튼들
         ======================= */}
         <div className="pt-6">
          <TypingBottomBar 
              title={song.title}
              artist={song.artist}
              imageUrl={song.imageUrl}
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
         {/* =======================
           사이드 세팅 바
         ======================= */}
         <SettingsSidebar 
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
         />
         {/* =======================
           사이드 리스트 바
         ======================= */}
         <LyricsListSidebar 
          open={isLyricsListOpen}
          onClose={() => setIsLyricsListOpen(false)}
          songs={songs}
         />
        </div>
  );
}
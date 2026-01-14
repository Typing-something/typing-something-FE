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
import { parseTypingLine } from "@/utils/parseTypingLine";
import { useSession } from "next-auth/react";
import { usePostTextResult } from "@/query/usePostTextResult";
import { usePostFavorite } from "@/query/usePostFavorite";

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
  const [localSongs, setLocalSongs] = useState<Song[]>(songs)
  const song = localSongs[songIndex];
  const rawText = song?.lyric ?? "가사가 없습니다(디버깅용)";
  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const { data: session, status } = useSession(); // authenticated / unauthenticated / loading
  const userId = session?.user.user_id;
  

  const postResultMutation = usePostTextResult();
  const postFavoriteMutation = usePostFavorite();
//   useEffect(() => {
//   console.log("TEXT NEWLINE SAMPLE:", JSON.stringify(text.slice(0, 80)));
//   console.log("INPUT NEWLINE SAMPLE:", JSON.stringify(input.slice(0, 80)));
// }, [text, input]);
  
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const focusInput = () => inputRef.current?.focus();

  const progress = Math.min(Math.round((input.length / text.length) * 100), 100);
  const cursorIndex = Math.min(input.length, text.length);
  
  const { metrics, resetMetrics } = useLiveTypingMetrics(text, input, isComposing);
  
  const wpm = metrics.wpm;
  const cpm = metrics.cpm;
  const acc = metrics.acc;

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // topbar디스플레이용 metrics
  const displayWpm = isResultOpen ? 0 : metrics.wpm;
  const displayCpm = isResultOpen ? 0 : metrics.cpm;
  const displayAcc = isResultOpen ? 100 : metrics.acc;
  
  // const isFinished = input.length >= text.length; // normalize 정책이면 필요시 더 엄격히
  const stableInput = input.slice(0, Math.max(0, input.length - (isComposing ? 1 : 0)));
  const parsed = parseTypingLine(text, stableInput, 5);
  
  // 모든 글자가 untyped가 아니면 끝(=커서가 끝까지 감)
  const isFinished = parsed.cursorIndex >= text.length;

  /// 컨트롤바로 조작 로직
  const canNext = songIndex < localSongs.length - 1;

  const pendingFocusRef = useRef(false); //true:  포커스를 줘야 할 일이 예약되어 있음

  const handleCloseResult = () => {
    setIsResultOpen(false);

    if(result && canNext){
      goNextSong();
    }
    // 마지막 곡이면 현재 곡 다시 시작
    if(result && !canNext){
      resetForSong();
    }
  }
  const resetForSong = () => {
    setInput("");
    setIsComposing(false);
    setIsResultOpen(false);
    setResult(null);
    resetMetrics();
    requestAnimationFrame(() => focusInput());
  };

  const goNextSong = () => {
    if (!canNext) return;
    setSongIndex((i) => i + 1);
  };
  /// 컨트롤바로 조작 로직 end

  // 사이드바 리스트에서 인덱스 조작
  const selectSong = (nextIndex: number) => {
    if (nextIndex === songIndex) return;

    pendingFocusRef.current = true;
    setSongIndex(nextIndex);
    setIsLyricsListOpen(false); // 먼저 닫기
  };

  const toggleFavorite = async (textId: number) => {
    console.log("fav click", { status, userId, pending: postFavoriteMutation.isPending });

    if (status !== "authenticated") return;
    if (!userId) return;
    if (postFavoriteMutation.isPending) return;
  
    // 현재 값 저장(rollback용)
    const prev = localSongs.find((s) => s.songId === textId)?.isFavorite ?? false;
  
    // optimistic: 먼저 반전
    setLocalSongs((prevSongs) =>
      prevSongs.map((s) =>
        s.songId === textId ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  
    try {
      await postFavoriteMutation.mutateAsync({
        user_id: userId,
        text_id: textId,
      });
      // 성공이면 noop (이미 UI 반영됨)
    } catch {
      // 실패면 rollback
      setLocalSongs((prevSongs) =>
        prevSongs.map((s) =>
          s.songId === textId ? { ...s, isFavorite: prev } : s
        )
      );
    }
  };

  useEffect(() => setLocalSongs(songs), [songs])
  
  useEffect(() => {
    if (!isLyricsListOpen && pendingFocusRef.current) {
      pendingFocusRef.current = false;
  
      // 닫힘 애니메이션/렌더 후 포커스 (2프레임)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          inputRef.current?.focus({ preventScroll: true });
        });
      });
    }
  }, [isLyricsListOpen]);

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

      const final = { wpm: metrics.wpm, cpm: metrics.cpm, acc: metrics.acc};

      // 1) 로그인 여부 상관없이 모달은 띄움
      setResult(final);
      setIsResultOpen(true);

      // 2) 로그인 상태일 때만 저장
      if(status !== "authenticated") return;
      if(postResultMutation.isPending) return; // 중복 방지

      postResultMutation.mutate({
        text_id: song.songId,
        cpm: final.cpm,
        wpm: final.wpm,
        accuracy: final.acc,
        combo: 0,
      })
    };
  
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isComposing,
    isFinished,
    metrics.wpm,
    metrics.cpm,
    metrics.acc,
    song.songId,
    status,
    postResultMutation,
  ]);
 
  if(!localSongs || localSongs.length === 0) {
    return <div className="w-full max-w-4xl">곡이 없습니다.</div>
  }
  return (
    <div className="w-full max-w-4xl ">
      {/* =======================
          상단: 타이틀 + Stats + Progress
         ======================= */}
      <div className="mb-16">
        <TypingTopBar 
          wpm={displayWpm} 
          cpm={displayCpm} 
          acc={displayAcc}
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
              progress={progress}
              isFavorite={song.isFavorite}
              onToggleFavorite={() => toggleFavorite(song.songId)}
            />
         </div>
       </div>
        
         {/* =======================
           결과 모달
         ======================= */}
        <ResultModal
          open={isResultOpen}
          result={result}
          onClose={handleCloseResult}
          song={{
            songId: song.songId,
            imageUrl: song.imageUrl,
            title: song.title,
            artist: song.artist,
            lyric: text,
            isFavorite: song.isFavorite,
          }}
          onToggleFavorite={() => toggleFavorite(song.songId)}
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
          songs={localSongs}
          activeIndex={songIndex}
          onSelectSong={selectSong}
         />
        </div>
  );
}
"use client";

import type { Song } from "@/app/page";
import { TypingDisplay } from "../molecules/TypingDisplay";
import { useState, useRef } from "react";
import { TypingInput } from "../atoms/TypingInput";

type Props = {
    song: {
        songId: number;
        title: string;
        artist: string;
        lyrice: string;
    }
}

export function SongTypeBoard({song}: Props){
    const [input, setInput] = useState("");
    const text = song?.lyrice ?? "가사가 없습니다(디버깅용)"
    const inputRef = useRef<HTMLInputElement | null>(null);
    const focusInput = () => {
        inputRef.current?.focus();
    }
    const progress = Math.min(
        Math.round((input.length / text.length) * 100),
        100
    );
    const cursorIndex = Math.min(input.length, text.length);
    return (
        <div className="w-full max-w-4xl rounded-xl border border-neutral-300 bg-white shadow-lg">
            {/* 상단 정보 영역 */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 text-sm">
                <div>
                    <div className="font-semibold">{song.title}</div>
                    <div className="text-xs text-neutral-500">by {song.artist}</div>
                </div>
                <div className="text-[11px] text-neutral-400">
                    Typing Something · Code typing practice
                </div>
            </div>
                {/* 가사 타자 영역 */}
            <div className="px-6 py-6 space-y-4" onClick={focusInput}>
                {/* 가사 표시 */}
                <TypingDisplay text={text} input={input} cursorIndex={cursorIndex}/>
                
                {/* 진행도 바 */}
                <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all"
                        style={{width: `${progress}%`}}
                    />
                </div>
                {/* 인풋 영역 */}
                <TypingInput ref={inputRef} value={input} onChange={setInput}/>
            </div>
            
            {/* 하단 바 - 나중에 WPM/ACC 등 들어갈 자리 */}
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
                <span>Song ID: {song.songId}</span>
                <span>Press Enter to start typing</span>
                <span>{progress}% complete</span>
            </div>
        </div>
    )
}
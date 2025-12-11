"use client";

import type { Song } from "@/app/page";

type Props = {
    song: {
        songId: number;
        title: string;
        artist: string;
        lyrice: string;
    }
}

export function SongTypeBoard({song}: Props){
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
            <div className="px-6 py-6 leading-7 text-neutral-800">{song.lyrice}</div>
            {/* 하단 바 - 나중에 WPM/ACC 등 들어갈 자리 */}
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
                <span>Song ID: {song.songId}</span>
                <span>Press Enter to start typing</span>
            </div>
        </div>
    )
}
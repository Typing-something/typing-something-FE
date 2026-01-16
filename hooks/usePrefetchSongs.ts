// hooks/usePrefetchSongs.ts
"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "@/types/song";

type FetchMoreSongs = (userId?: number) => Promise<Song[]>;

type Options = {
  initialSongs: Song[];
  songIndex: number;
  userId?: number;
  status: "authenticated" | "unauthenticated" | "loading";
  fetchMoreSongs: FetchMoreSongs;

  // 옵션
  prefetchFromEnd?: number; // 끝에서 N곡 남으면 프리페치 (default: 2)
  maxPrefetch?: number;     // 세션당 최대 프리페치 횟수 (default: 2)
};

export function usePrefetchSongs({
  initialSongs,
  songIndex,
  userId,
  status,
  fetchMoreSongs,
  prefetchFromEnd = 2,
  maxPrefetch = 2,
}: Options) {
  const [songs, setSongs] = useState<Song[]>(() => initialSongs);
  const [isPrefetching, setIsPrefetching] = useState(false);

  const prefetchCountRef = useRef(0);
  const reqIdRef = useRef(0);

  // 초기 songs 바뀌는 케이스가 “정말” 있다면 이 effect를 켜기
  // 지금은 Home에서 한 번 내려오고 끝이면 필요 없음.
  // useEffect(() => {
  //   setSongs(initialSongs);
  //   prefetchCountRef.current = 0;
  // }, [initialSongs]);

  useEffect(() => {
    const total = songs.length;
    if (total === 0) return;

    const threshold = Math.max(0, total - prefetchFromEnd);
    const shouldPrefetch = songIndex >= threshold;

    if (!shouldPrefetch) return;
    if (isPrefetching) return;
    if (prefetchCountRef.current >= maxPrefetch) return;

    const reqId = ++reqIdRef.current;

    (async () => {
      try {
        setIsPrefetching(true);

        const more = await fetchMoreSongs(
          status === "authenticated" && userId ? Number(userId) : undefined
        );

        // 최신 요청만 반영 (race condition 방지)
        if (reqId !== reqIdRef.current) return;

        setSongs((prev) => {
          const seen = new Set(prev.map((s) => s.songId));
          const deduped = more.filter((s) => !seen.has(s.songId));
          return deduped.length ? [...prev, ...deduped] : prev;
        });

        prefetchCountRef.current += 1;
      } catch (e) {
        console.error("[prefetch error]", e);
      } finally {
        if (reqId === reqIdRef.current) setIsPrefetching(false);
      }
    })();
  }, [songIndex, songs.length, isPrefetching, status, userId, fetchMoreSongs, prefetchFromEnd, maxPrefetch]);

  return { songs, setSongs, isPrefetching };
}
/**
 * 이 테스트가 없으면 재발하는 버그:
 * 프리페치 제어 로직에서 중복 곡이 추가되거나,
 * maxPrefetch 초과 시 무한 fetch가 발생하는 문제
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePrefetchSongs } from "@/hooks/usePrefetchSongs";
import type { Song } from "@/types/song";

// --- 헬퍼 ---
function makeSong(id: number): Song {
  return {
    songId: id,
    title: `Song ${id}`,
    artist: `Artist ${id}`,
    lyric: `Lyric ${id}`,
    imageUrl: `https://example.com/${id}.jpg`,
    isFavorite: false,
  };
}

function makeDefaultOptions(overrides: Record<string, unknown> = {}) {
  return {
    initialSongs: [makeSong(1), makeSong(2), makeSong(3)],
    songIndex: 0,
    status: "unauthenticated" as const,
    fetchMoreSongs: jest.fn<Promise<Song[]>, [number?]>().mockResolvedValue([]),
    ...overrides,
  };
}

describe("usePrefetchSongs", () => {
  // --- 초기 상태 ---
  describe("초기 상태 안정성", () => {
    it("Given initialSongs, When 훅 마운트, Then songs가 initialSongs와 동일", () => {
      const options = makeDefaultOptions();
      const { result } = renderHook(() => usePrefetchSongs(options));

      expect(result.current.songs).toEqual(options.initialSongs);
      expect(result.current.isPrefetching).toBe(false);
    });
  });

  // --- fetch 트리거 ---
  describe("fetch 트리거", () => {
    it("Given songIndex가 threshold 미만, When 렌더, Then fetch하지 않음", () => {
      const options = makeDefaultOptions({ songIndex: 0 });
      renderHook(() => usePrefetchSongs(options));

      expect(options.fetchMoreSongs).not.toHaveBeenCalled();
    });

    it("Given songIndex가 threshold 도달, When 렌더, Then fetchMoreSongs 호출", async () => {
      const newSongs = [makeSong(4), makeSong(5)];
      const fetchMoreSongs = jest.fn<Promise<Song[]>, [number?]>().mockResolvedValue(newSongs);
      const options = makeDefaultOptions({
        songIndex: 1, // 3곡 중 index 1 = 끝에서 2곡 → threshold 도달
        fetchMoreSongs,
      });

      renderHook(() => usePrefetchSongs(options));

      await waitFor(() => {
        expect(fetchMoreSongs).toHaveBeenCalledTimes(1);
      });
    });
  });

  // --- 중복 제거 ---
  describe("중복 제거", () => {
    it("Given 이미 있는 songId 반환, When fetch 완료, Then 중복 곡은 추가되지 않음", async () => {
      const fetchMoreSongs = jest.fn<Promise<Song[]>, [number?]>().mockResolvedValue([
        makeSong(1), // 중복
        makeSong(2), // 중복
        makeSong(4), // 신규
      ]);
      const options = makeDefaultOptions({
        songIndex: 1,
        fetchMoreSongs,
      });

      const { result } = renderHook(() => usePrefetchSongs(options));

      await waitFor(() => {
        expect(result.current.songs).toHaveLength(4); // 기존 3 + 신규 1
      });

      const songIds = result.current.songs.map((s) => s.songId);
      expect(songIds).toEqual([1, 2, 3, 4]);
    });

    it("Given 전부 중복인 응답, When fetch 완료, Then songs 변화 없음", async () => {
      const fetchMoreSongs = jest.fn<Promise<Song[]>, [number?]>().mockResolvedValue([
        makeSong(1),
        makeSong(2),
        makeSong(3),
      ]);
      const options = makeDefaultOptions({
        songIndex: 1,
        fetchMoreSongs,
      });

      const { result } = renderHook(() => usePrefetchSongs(options));

      await waitFor(() => {
        expect(fetchMoreSongs).toHaveBeenCalled();
      });

      expect(result.current.songs).toHaveLength(3);
    });
  });

  // --- 종료 조건 (maxPrefetch) ---
  describe("종료 조건 (maxPrefetch)", () => {
    it("Given maxPrefetch=1, When 1회 fetch 완료 후 threshold 재도달, Then 추가 fetch 없음", async () => {
      let callCount = 0;
      const fetchMoreSongs = jest.fn<Promise<Song[]>, [number?]>().mockImplementation(async () => {
        callCount++;
        return [makeSong(10 + callCount)];
      });

      const options = makeDefaultOptions({
        initialSongs: [makeSong(1), makeSong(2), makeSong(3)],
        songIndex: 1,
        fetchMoreSongs,
        maxPrefetch: 1,
      });

      const { result, rerender } = renderHook(
        (props) => usePrefetchSongs(props),
        { initialProps: options }
      );

      // 첫 번째 fetch 완료 대기
      await waitFor(() => {
        expect(result.current.songs).toHaveLength(4);
      });

      // songIndex를 끝 쪽으로 이동 → threshold 재도달
      rerender({ ...options, songIndex: 2 });

      // 약간 대기 후에도 추가 호출 없음 확인
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      expect(fetchMoreSongs).toHaveBeenCalledTimes(1);
    });
  });
});

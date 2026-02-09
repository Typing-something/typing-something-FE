/**
 * 이 테스트가 없으면 재발하는 버그:
 * 타이핑 중 실시간 지표(CPM/WPM/ACC)가 NaN·Infinity로 표시되거나,
 * 조합 중(isComposing) 정책이 무시되어 정확도가 잘못 계산되는 문제
 */
import { renderHook, act } from "@testing-library/react";
import { useLiveTypingMetrics } from "@/hooks/useLiveTypingMetrics";

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(Date, "now");
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const setNow = (ms: number) =>
  (Date.now as jest.Mock).mockReturnValue(ms);

describe("useLiveTypingMetrics", () => {
  // --- 초기 상태 ---
  describe("초기 상태", () => {
    it("Given 입력 없음, When 훅 호출, Then 기본 지표 반환", () => {
      setNow(1000);
      const { result } = renderHook(() =>
        useLiveTypingMetrics("hello", "", false)
      );

      expect(result.current.metrics).toEqual({
        elapsedMs: 0,
        cpm: 0,
        wpm: 0,
        acc: 100,
      });
    });
  });

  // --- 입력 시 지표 변화 ---
  describe("입력 시 지표 변화", () => {
    it("Given 정확한 입력, When 시간 경과 후 tick, Then CPM/WPM > 0", () => {
      setNow(1000);
      const { result, rerender } = renderHook(
        ({ input }) => useLiveTypingMetrics("hello", input, false),
        { initialProps: { input: "" } }
      );

      // 첫 입력
      setNow(1000);
      rerender({ input: "h" });

      // 시간 경과 + tick
      setNow(2000);
      act(() => { jest.advanceTimersByTime(200); });

      expect(result.current.metrics.cpm).toBeGreaterThan(0);
      expect(result.current.metrics.wpm).toBeGreaterThan(0);
      expect(result.current.metrics.elapsedMs).toBeGreaterThan(0);
    });
  });

  // --- 정확도 ---
  describe("정확도 계산", () => {
    it("Given 정확한 입력, When 계산, Then acc=100", () => {
      setNow(1000);
      const { result, rerender } = renderHook(
        ({ input }) => useLiveTypingMetrics("abc", input, false),
        { initialProps: { input: "" } }
      );

      setNow(1000);
      rerender({ input: "abc" });

      setNow(2000);
      act(() => { jest.advanceTimersByTime(200); });

      expect(result.current.metrics.acc).toBe(100);
    });

    it("Given 오타 포함 입력, When 계산, Then acc < 100", () => {
      setNow(1000);
      const { result, rerender } = renderHook(
        ({ input }) => useLiveTypingMetrics("abc", input, false),
        { initialProps: { input: "" } }
      );

      setNow(1000);
      rerender({ input: "axc" });

      setNow(2000);
      act(() => { jest.advanceTimersByTime(200); });

      expect(result.current.metrics.acc).toBeLessThan(100);
    });
  });

  // --- isComposing ---
  describe("isComposing 정책", () => {
    it("Given 조합 중, When 마지막 글자가 오타, Then 마지막 글자 제외하고 정확도 계산", () => {
      setNow(1000);
      const { result, rerender } = renderHook(
        ({ input, isComposing }) =>
          useLiveTypingMetrics("ab", input, isComposing),
        { initialProps: { input: "", isComposing: false } }
      );

      // 'a' 입력 후 'ㅋ' 조합 중
      setNow(1000);
      rerender({ input: "aㅋ", isComposing: true });

      setNow(2000);
      act(() => { jest.advanceTimersByTime(200); });

      // 조합 중이므로 'ㅋ'은 제외 → 'a'만 비교 → acc=100
      expect(result.current.metrics.acc).toBe(100);
    });
  });

  // --- resetMetrics ---
  describe("resetMetrics", () => {
    it("Given 입력 진행 중, When resetMetrics 호출, Then 초기 상태로 복귀", () => {
      setNow(1000);
      const { result, rerender } = renderHook(
        ({ input }) => useLiveTypingMetrics("hello", input, false),
        { initialProps: { input: "" } }
      );

      setNow(1000);
      rerender({ input: "hel" });

      setNow(2000);
      act(() => { jest.advanceTimersByTime(200); });

      // 지표가 있는 상태 확인
      expect(result.current.metrics.elapsedMs).toBeGreaterThan(0);

      // reset
      act(() => { result.current.resetMetrics(); });

      setNow(3000);
      act(() => { jest.advanceTimersByTime(200); });

      expect(result.current.metrics).toEqual({
        elapsedMs: 0,
        cpm: 0,
        wpm: 0,
        acc: 100,
      });
    });
  });
});

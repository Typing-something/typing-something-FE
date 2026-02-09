/**
 * 이 테스트가 없으면 재발하는 버그:
 * 타이핑 엔진의 진행률/커서 계산이 원문 길이를 초과하거나,
 * 완료 조건이 올바르게 전환되지 않는 문제
 */
import { renderHook, act } from "@testing-library/react";
import { useTypingEngine } from "@/hooks/useTypingEngine";

describe("useTypingEngine", () => {
  // --- 초기 상태 ---
  describe("초기 상태", () => {
    it("Given 텍스트 제공, When 훅 호출, Then input 비어있고 progress 0", () => {
      const { result } = renderHook(() => useTypingEngine("hello"));

      expect(result.current.input).toBe("");
      expect(result.current.progress).toBe(0);
      expect(result.current.cursorIndex).toBe(0);
      expect(result.current.typedLength).toBe(0);
    });

    it("Given 빈 텍스트, When 훅 호출, Then progress 0", () => {
      const { result } = renderHook(() => useTypingEngine(""));

      expect(result.current.progress).toBe(0);
    });
  });

  // --- 완료 조건 ---
  describe("완료 조건", () => {
    it("Given 5글자 텍스트, When 5글자 입력, Then progress 100", () => {
      const { result } = renderHook(() => useTypingEngine("hello"));

      act(() => { result.current.setInput("hello"); });

      expect(result.current.progress).toBe(100);
      expect(result.current.cursorIndex).toBe(5);
    });

    it("Given 5글자 텍스트, When 3글자 입력, Then progress 60", () => {
      const { result } = renderHook(() => useTypingEngine("hello"));

      act(() => { result.current.setInput("hel"); });

      expect(result.current.progress).toBe(60);
      expect(result.current.cursorIndex).toBe(3);
    });
  });

  // --- clampToTextLength ---
  describe("clampToTextLength 옵션", () => {
    it("Given clamp 활성화, When 텍스트보다 긴 입력, Then 텍스트 길이까지만 허용", () => {
      const { result } = renderHook(() =>
        useTypingEngine("ab", { clampToTextLength: true })
      );

      act(() => { result.current.setInput("abcde"); });

      expect(result.current.input).toBe("ab");
      expect(result.current.progress).toBe(100);
    });

    it("Given clamp 비활성화(기본), When 텍스트보다 긴 입력, Then 초과 입력 허용", () => {
      const { result } = renderHook(() => useTypingEngine("ab"));

      act(() => { result.current.setInput("abcde"); });

      expect(result.current.input).toBe("abcde");
      expect(result.current.progress).toBe(100); // 100 초과 방지
      expect(result.current.cursorIndex).toBe(2); // 원문 길이까지만
    });
  });

  // --- reset ---
  describe("reset", () => {
    it("Given 입력 진행 중, When reset 호출, Then 입력과 진행률 초기화", () => {
      const { result } = renderHook(() => useTypingEngine("hello"));

      act(() => { result.current.setInput("hel"); });
      expect(result.current.progress).toBe(60);

      act(() => { result.current.reset(); });
      expect(result.current.input).toBe("");
      expect(result.current.progress).toBe(0);
      expect(result.current.cursorIndex).toBe(0);
    });
  });
});

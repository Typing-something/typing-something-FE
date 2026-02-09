/**
 * 이 테스트가 없으면 재발하는 버그:
 * 타이핑 시작 전/조합 중/입력 없을 때 NaN·Infinity가 지표에 노출되거나,
 * 정확도가 0~100 범위를 벗어나는 문제
 */
import { calcTypingMetrics } from "@/utils/calcTypingMetrics";

// Date.now()를 고정하여 시간 의존 로직을 결정적으로 테스트
beforeEach(() => {
  jest.spyOn(Date, "now");
});
afterEach(() => {
  jest.restoreAllMocks();
});

const setNow = (ms: number) =>
  (Date.now as jest.Mock).mockReturnValue(ms);

describe("calcTypingMetrics", () => {
  // --- 초기 상태 ---
  describe("초기 상태 (startedAt === null)", () => {
    it("Given startedAt이 null, When 호출, Then 기본값 반환 (NaN/Infinity 없음)", () => {
      const result = calcTypingMetrics("hello", "", null, false);

      expect(result).toEqual({ elapsedMs: 0, cpm: 0, wpm: 0, acc: 100 });
    });

    it("Given startedAt이 null, When 입력이 있어도, Then 기본값 반환", () => {
      const result = calcTypingMetrics("hello", "hel", null, false);

      expect(result).toEqual({ elapsedMs: 0, cpm: 0, wpm: 0, acc: 100 });
    });
  });

  // --- 정상 입력 ---
  describe("정상 입력 시 지표 계산", () => {
    it("Given 1분 경과 + 60자 입력, When 계산, Then CPM=60, WPM=12", () => {
      const startedAt = 1000;
      setNow(61000); // 1분 경과

      const text = "a".repeat(60);
      const input = "a".repeat(60);
      const result = calcTypingMetrics(text, input, startedAt, false);

      expect(result.cpm).toBe(60);
      expect(result.wpm).toBe(12); // 60 / 5
      expect(result.acc).toBe(100);
    });

    it("Given 30초 경과 + 30자 입력, When 계산, Then CPM=60, WPM=12", () => {
      const startedAt = 1000;
      setNow(31000);

      const text = "a".repeat(30);
      const input = "a".repeat(30);
      const result = calcTypingMetrics(text, input, startedAt, false);

      expect(result.cpm).toBe(60);
      expect(result.wpm).toBe(12);
    });
  });

  // --- 정확도 ---
  describe("정확도 계산", () => {
    it("Given 모든 입력이 정확, When 계산, Then acc=100", () => {
      setNow(11000);
      const result = calcTypingMetrics("abc", "abc", 1000, false);

      expect(result.acc).toBe(100);
    });

    it("Given 절반 오타, When 계산, Then acc=50", () => {
      setNow(11000);
      const result = calcTypingMetrics("abcd", "axcx", 1000, false);

      expect(result.acc).toBe(50);
    });

    it("Given 전부 오타, When 계산, Then acc=0", () => {
      setNow(11000);
      const result = calcTypingMetrics("abc", "xyz", 1000, false);

      expect(result.acc).toBe(0);
    });

    it("Given 입력이 비어있음, When 계산, Then acc=100 (comparableLen=0)", () => {
      setNow(11000);
      const result = calcTypingMetrics("abc", "", 1000, false);

      expect(result.acc).toBe(100);
    });
  });

  // --- isComposing ---
  describe("isComposing 처리", () => {
    it("Given 조합 중, When 계산, Then 마지막 글자 제외하고 정확도 계산", () => {
      setNow(11000);
      // text="ab", input="ax" 중 마지막 'x'가 조합 중 → comparableLen = 2-1 = 1
      const result = calcTypingMetrics("ab", "ax", 1000, true);

      // comparableLen=1, input[0]==='a'===text[0] → correct=1 → acc=100
      expect(result.acc).toBe(100);
    });

    it("Given 조합 중이 아님, When 계산, Then 전체 글자로 정확도 계산", () => {
      setNow(11000);
      const result = calcTypingMetrics("ab", "ax", 1000, false);

      // comparableLen=2, correct=1 → acc=50
      expect(result.acc).toBe(50);
    });
  });

  // --- 엣지케이스 ---
  describe("엣지케이스", () => {
    it("Given 입력이 텍스트보다 긴 경우, When 계산, Then 텍스트 길이까지만 비교", () => {
      setNow(11000);
      const result = calcTypingMetrics("ab", "abcd", 1000, false);

      // comparableLen = min(2, 4) = 2, correct=2 → acc=100
      expect(result.acc).toBe(100);
    });

    it("Given 경과 시간이 0에 가까움, When 계산, Then Infinity 없이 정상 반환", () => {
      setNow(1001); // startedAt=1000, elapsed=1ms
      const result = calcTypingMetrics("a", "a", 1000, false);

      expect(isFinite(result.cpm)).toBe(true);
      expect(isFinite(result.wpm)).toBe(true);
    });
  });
});

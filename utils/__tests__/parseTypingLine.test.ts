/**
 * 이 테스트가 없으면 재발하는 버그:
 * 타이핑 입력 비교 로직에서 오타/스킵/공백 처리가 잘못되어
 * 사용자에게 incorrect 상태가 올바르게 표시되지 않는 문제
 */
import { parseTypingLine } from "@/utils/parseTypingLine";

describe("parseTypingLine", () => {
  // --- 정상 입력 ---
  describe("정확한 입력", () => {
    it("Given 영문 텍스트, When 동일하게 입력, Then 모든 상태가 correct", () => {
      const result = parseTypingLine("hello", "hello");

      expect(result.states).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
      expect(result.cursorIndex).toBe(5);
    });

    it("Given 한글 텍스트, When 동일하게 입력, Then 모든 상태가 correct", () => {
      const result = parseTypingLine("안녕하세요", "안녕하세요");

      expect(result.states).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
    });

    it("Given 한글/영문 혼합 텍스트, When 동일하게 입력, Then 모든 상태가 correct", () => {
      const result = parseTypingLine("hello 세계", "hello 세계");

      expect(result.states).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
    });
  });

  // --- 오타 처리 ---
  describe("오타 입력", () => {
    it("Given 영문 텍스트, When 틀린 글자 입력, Then 해당 위치가 wrong", () => {
      const result = parseTypingLine("abc", "axc");

      expect(result.states).toEqual(["correct", "wrong", "correct"]);
      expect(result.typedAt[1]).toBe("x");
    });

    it("Given 한글 텍스트, When 틀린 글자 입력, Then 해당 위치가 wrong", () => {
      const result = parseTypingLine("가나다", "가라다");

      expect(result.states).toEqual(["correct", "wrong", "correct"]);
      expect(result.typedAt[1]).toBe("라");
    });
  });

  // --- 부분 입력 ---
  describe("부분 입력", () => {
    it("Given 긴 텍스트, When 일부만 입력, Then 나머지는 untyped", () => {
      const result = parseTypingLine("abcde", "ab");

      expect(result.states).toEqual([
        "correct",
        "correct",
        "untyped",
        "untyped",
        "untyped",
      ]);
      expect(result.cursorIndex).toBe(2);
    });
  });

  // --- 공백 처리 ---
  describe("공백(스페이스) 처리", () => {
    it("Given 공백 포함 텍스트, When 공백을 정확히 입력, Then 공백 위치가 correct", () => {
      const result = parseTypingLine("a b", "a b");

      expect(result.states).toEqual(["correct", "correct", "correct"]);
    });

    it("Given 공백 위치에서, When 다른 문자 입력, Then extrasBeforeSpace에 기록", () => {
      const result = parseTypingLine("a b", "ax");

      expect(result.states[0]).toBe("correct");
      expect(result.states[1]).toBe("untyped"); // 공백은 아직 통과 못함
      expect(result.extrasBeforeSpace[1]).toBe("x");
    });

    it("Given 글자 위치에서, When 스페이스 입력, Then 다음 공백까지 skipped", () => {
      const result = parseTypingLine("abc def", " ");

      expect(result.states).toEqual([
        "skipped",
        "skipped",
        "skipped",
        "correct",
        "untyped",
        "untyped",
        "untyped",
      ]);
    });
  });

  // --- 오타 허용 개수 (maxExtra) ---
  describe("오타 허용 개수 제한 (extrasBeforeSpace)", () => {
    it("Given maxExtra=5, When 공백 위치에서 5개 오타 입력, Then 5개까지 기록", () => {
      const result = parseTypingLine("a b", "a12345", 5);

      expect(result.extrasBeforeSpace[1]).toBe("12345");
    });

    it("Given maxExtra=5, When 공백 위치에서 6개 오타 입력, Then 5개까지만 기록", () => {
      const result = parseTypingLine("a b", "a123456", 5);

      expect(result.extrasBeforeSpace[1]).toBe("12345");
    });
  });

  // --- 연속 공백 ---
  describe("연속 공백 처리", () => {
    it("Given 연속 공백 텍스트, When 정확히 입력, Then 모두 correct", () => {
      const result = parseTypingLine("a  b", "a  b");

      expect(result.states).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
    });
  });

  // --- 특수문자 / 문장부호 ---
  describe("특수문자 및 문장부호", () => {
    it("Given 문장부호 포함 텍스트, When 정확히 입력, Then 일반 글자와 동일하게 correct", () => {
      const result = parseTypingLine("a, b!", "a, b!");

      expect(result.states).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
    });

    it("Given 문장부호 위치에서, When 틀린 입력, Then wrong 처리", () => {
      const result = parseTypingLine("a.", "ax");

      expect(result.states).toEqual(["correct", "wrong"]);
    });
  });

  // --- 빈 입력 / 빈 텍스트 ---
  describe("빈 줄 / 빈 입력", () => {
    it("Given 빈 텍스트, When 빈 입력, Then 빈 결과", () => {
      const result = parseTypingLine("", "");

      expect(result.states).toEqual([]);
      expect(result.cursorIndex).toBe(0);
    });

    it("Given 텍스트 있음, When 빈 입력, Then 모두 untyped", () => {
      const result = parseTypingLine("abc", "");

      expect(result.states).toEqual(["untyped", "untyped", "untyped"]);
      expect(result.cursorIndex).toBe(0);
    });

    it("Given 공백만 있는 텍스트, When 공백 입력, Then correct", () => {
      const result = parseTypingLine(" ", " ");

      expect(result.states).toEqual(["correct"]);
    });
  });

  // --- inputToText / inputToExtra 매핑 ---
  describe("입력 인덱스 매핑", () => {
    it("Given 정상 입력, When 매핑 확인, Then inputToText가 순서대로 매핑", () => {
      const result = parseTypingLine("ab", "ab");

      expect(result.inputToText).toEqual([0, 1]);
      expect(result.inputToExtra).toEqual([null, null]);
    });

    it("Given 공백 위치 오타, When 매핑 확인, Then inputToExtra에 위치 기록", () => {
      const result = parseTypingLine("a b", "ax");

      expect(result.inputToText[1]).toBe(-1);
      expect(result.inputToExtra[1]).toEqual({ spaceIndex: 1, offset: 0 });
    });
  });
});

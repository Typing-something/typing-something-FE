/**
 * 이 테스트가 없으면 재발하는 버그:
 * 띄어쓰기 위치에서 오타 처리, 오타 허용 개수 제한, 스페이스 스킵,
 * 줄바꿈 전환 등 타자 규칙이 잘못 적용되어 입력 흐름이 깨지는 문제
 *
 * parseTypingLine: 입력 결과 상태 판정 (correct/wrong/skipped/untyped)
 * normalizeInputLines: 입력 정규화 (오타 제한, 줄바꿈 변환 등)
 */
import { parseTypingLine } from "@/utils/parseTypingLine";
import { normalizeInputLines } from "@/utils/typingLine";

describe("타자 규칙 기반 입력 처리", () => {
  // ─── 규칙 1: 띄어쓰기 위치 규칙 ───
  describe("규칙 1: 띄어쓰기 위치에서의 입력", () => {
    it("Given target이 공백, When 공백 입력, Then correct로 정상 진행", () => {
      const result = parseTypingLine("a b", "a b");

      expect(result.states[1]).toBe("correct");
    });

    it("Given target이 공백, When 다른 문자 입력, Then 오타 처리 + 공백 위치 진행 불가", () => {
      const result = parseTypingLine("a b", "ax");

      expect(result.states[1]).toBe("untyped"); // 공백은 통과 못함
      expect(result.extrasBeforeSpace[1]).toBe("x");
    });

    it("Given target이 공백, When 여러 오타 후 공백, Then 공백에서 진행 재개", () => {
      const result = parseTypingLine("a b", "axy b");

      expect(result.extrasBeforeSpace[1]).toBe("xy");
      expect(result.states[1]).toBe("correct");
      expect(result.states[2]).toBe("correct");
    });
  });

  // ─── 규칙 2: 글자 위 띄어쓰기 ───
  describe("규칙 2: 글자 위치에서 Space 입력", () => {
    it("Given target이 글자, When Space 입력, Then 다음 공백까지 skipped 처리", () => {
      const result = parseTypingLine("abc def", " ");

      expect(result.states[0]).toBe("skipped");
      expect(result.states[1]).toBe("skipped");
      expect(result.states[2]).toBe("skipped");
      expect(result.states[3]).toBe("correct"); // 공백 위치
    });

    it("Given 공백 없는 텍스트, When Space 입력, Then 끝까지 skipped", () => {
      const result = parseTypingLine("abc", " ");

      expect(result.states).toEqual(["skipped", "skipped", "skipped"]);
    });
  });

  // ─── 규칙 3: 오타 허용 개수 제한 ───
  describe("규칙 3: 오타 허용 개수 제한 (maxExtra=5)", () => {
    it("Given 공백 위치에서 5개 오타, When 입력, Then 5개까지 기록", () => {
      const result = parseTypingLine("a b", "a12345", 5);

      expect(result.extrasBeforeSpace[1]).toBe("12345");
    });

    it("Given 공백 위치에서 6개 오타, When 입력, Then 5개까지만 기록 (6번째 무시)", () => {
      const result = parseTypingLine("a b", "a123456", 5);

      expect(result.extrasBeforeSpace[1]).toBe("12345");
    });

    it("Given normalizeInputLines에서도 동일, When 6개 오타, Then 5개까지만 출력", () => {
      const result = normalizeInputLines(["a b"], "a123456", 5);

      expect(result).toBe("a12345");
    });
  });

  // ─── 규칙 4: 오타 제거 규칙 ───
  describe("규칙 4: 오타는 backspace로만 제거", () => {
    it("Given 오타 입력 후, When 추가 입력, Then 오타가 자동 제거되지 않음", () => {
      // "abc"에서 "ax" 입력 → 'x'는 wrong, 추가 입력 'c'는 다음 위치에 매핑
      const result = parseTypingLine("abc", "axc");

      expect(result.states[0]).toBe("correct");
      expect(result.states[1]).toBe("wrong"); // 오타 유지
      expect(result.states[2]).toBe("correct");
    });

    it("Given 오타가 있는 상태, When 새 글자 입력, Then 오타 위치 상태 변하지 않음", () => {
      const first = parseTypingLine("abcd", "ax");
      expect(first.states[1]).toBe("wrong");

      // backspace로 'x' 제거 후 'b' 입력하면 correct
      const fixed = parseTypingLine("abcd", "ab");
      expect(fixed.states[1]).toBe("correct");
    });
  });

  // ─── 규칙 5: 문장부호 처리 ───
  describe("규칙 5: 문장부호는 일반 글자와 동일 규칙", () => {
    const punctuations = [".", ",", "!", "?"];

    it.each(punctuations)(
      "Given target이 '%s', When 정확히 입력, Then correct",
      (p) => {
        const result = parseTypingLine(p, p);
        expect(result.states[0]).toBe("correct");
      }
    );

    it.each(punctuations)(
      "Given target이 '%s', When 다른 문자 입력, Then wrong",
      (p) => {
        const result = parseTypingLine(p, "x");
        expect(result.states[0]).toBe("wrong");
      }
    );

    it("Given 문장부호 위치에서 Space, When 뒤에 공백 있음, Then skipped 처리", () => {
      const result = parseTypingLine(". a", " ");

      expect(result.states[0]).toBe("skipped");
      expect(result.states[1]).toBe("correct"); // 공백
    });
  });

  // ─── 규칙 6: 스페이스바 줄바꿈 ───
  describe("규칙 6: 라인 끝에서 Space → 줄바꿈", () => {
    it("Given 라인 끝 도달, When Space 입력, Then 줄바꿈(\\n)으로 변환", () => {
      const result = normalizeInputLines(["ab", "cd"], "ab cd");

      expect(result).toBe("ab\ncd");
    });

    it("Given 라인 끝 도달, When 다른 문자 입력, Then 무시", () => {
      const result = normalizeInputLines(["ab", "cd"], "abx");

      expect(result).toBe("ab");
    });

    it("Given 여러 줄, When 각 줄 끝에서 Space, Then 순서대로 줄바꿈", () => {
      const result = normalizeInputLines(["a", "b", "c"], "a b c");

      expect(result).toBe("a\nb\nc");
    });
  });
});

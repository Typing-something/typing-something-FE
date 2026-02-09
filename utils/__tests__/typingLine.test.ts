/**
 * 이 테스트가 없으면 재발하는 버그:
 * \r\n / \r 개행이 섞인 가사에서 라인 분리가 깨지거나,
 * 입력 정규화에서 줄바꿈/오타 제한이 올바르게 동작하지 않는 문제
 */
import { splitLines, normalizeInputLines } from "@/utils/typingLine";

// ─── splitLines ───
describe("splitLines", () => {
  it("Given \\n 개행, When 분리, Then 줄 단위 배열 반환", () => {
    expect(splitLines("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  it("Given \\r\\n 개행, When 분리, Then \\n과 동일 결과", () => {
    expect(splitLines("a\r\nb\r\nc")).toEqual(["a", "b", "c"]);
  });

  it("Given \\r 단독 개행, When 분리, Then \\n과 동일 결과", () => {
    expect(splitLines("a\rb\rc")).toEqual(["a", "b", "c"]);
  });

  it("Given 혼합 개행(\\r\\n + \\n), When 분리, Then 모두 동일하게 처리", () => {
    expect(splitLines("a\r\nb\nc")).toEqual(["a", "b", "c"]);
  });

  it("Given 마지막 줄에 개행 있음, When 분리, Then 빈 문자열 포함", () => {
    expect(splitLines("a\nb\n")).toEqual(["a", "b", ""]);
  });

  it("Given 마지막 줄에 개행 없음, When 분리, Then 빈 문자열 없음", () => {
    expect(splitLines("a\nb")).toEqual(["a", "b"]);
  });

  it("Given 빈 라인 포함, When 분리, Then 빈 문자열 요소 유지", () => {
    expect(splitLines("a\n\nb")).toEqual(["a", "", "b"]);
  });

  it("Given 빈 문자열, When 분리, Then 빈 문자열 1개 배열", () => {
    expect(splitLines("")).toEqual([""]);
  });

  it("Given 개행만 있는 문자열, When 분리, Then 빈 문자열 배열", () => {
    expect(splitLines("\n")).toEqual(["", ""]);
  });
});

// ─── normalizeInputLines ───
describe("normalizeInputLines", () => {
  describe("기본 입력", () => {
    it("Given 한 줄 텍스트, When 그대로 입력, Then 동일 출력", () => {
      expect(normalizeInputLines(["hello"], "hello")).toBe("hello");
    });

    it("Given 한글 텍스트, When 그대로 입력, Then 동일 출력", () => {
      expect(normalizeInputLines(["안녕하세요"], "안녕하세요")).toBe("안녕하세요");
    });
  });

  describe("줄바꿈 처리", () => {
    it("Given 입력에 \\n 포함, When 정규화, Then 다음 줄로 이동", () => {
      expect(normalizeInputLines(["ab", "cd"], "ab\ncd")).toBe("ab\ncd");
    });

    it("Given 라인 끝에서 Space, When 정규화, Then \\n으로 변환(줄바꿈)", () => {
      expect(normalizeInputLines(["ab", "cd"], "ab cd")).toBe("ab\ncd");
    });
  });

  describe("공백 위치 오타 제한 (maxExtra)", () => {
    it("Given 공백 위치에 오타 5개, When maxExtra=5, Then 5개 모두 포함", () => {
      const result = normalizeInputLines(["a b"], "a12345", 5);
      expect(result).toBe("a12345");
    });

    it("Given 공백 위치에 오타 6개, When maxExtra=5, Then 5개까지만 포함", () => {
      const result = normalizeInputLines(["a b"], "a123456", 5);
      expect(result).toBe("a12345");
    });

    it("Given 공백 위치에 오타 후 Space, When 정규화, Then 오타 + 공백 통과", () => {
      const result = normalizeInputLines(["a b"], "ax b", 5);
      expect(result).toBe("ax b");
    });
  });

  describe("Space 스킵", () => {
    it("Given 글자 위치에서 Space, When 정규화, Then 다음 공백까지 스킵", () => {
      const result = normalizeInputLines(["abc def"], " ");
      expect(result).toBe(" ");
    });
  });

  describe("범위 초과", () => {
    it("Given 모든 줄 끝 이후 입력, When 정규화, Then 추가 입력 무시", () => {
      const result = normalizeInputLines(["ab"], "abcde");
      expect(result).toBe("ab");
    });

    it("Given 줄 수 초과, When 정규화, Then 초과분 무시", () => {
      const result = normalizeInputLines(["a"], "a b");
      expect(result).toBe("a\n");
    });
  });
});

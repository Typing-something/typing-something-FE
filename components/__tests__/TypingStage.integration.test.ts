/**
 * 이 테스트가 없으면 재발하는 버그:
 * 짧은 가사를 끝까지 입력했을 때 완료 판정이 누락되거나,
 * 입력 정규화 → 파싱 → 완료 조건의 파이프라인이 깨지는 문제
 *
 * 통합 테스트: normalizeInputLines → parseTypingLine → 완료 판정 흐름 검증
 */
import { splitLines, normalizeInputLines } from "@/utils/typingLine";
import { parseTypingLine } from "@/utils/parseTypingLine";

/**
 * SongTypeBoard의 완료 판정 로직을 재현:
 * - text를 정규화하고
 * - input을 normalizeInputLines로 정규화하고
 * - parseTypingLine으로 파싱하여
 * - cursorIndex >= text.length이면 완료
 */
function simulateTypingFlow(rawText: string, rawInput: string) {
  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = splitLines(text);
  const normalizedInput = normalizeInputLines(lines, rawInput, 5);
  const parsed = parseTypingLine(text, normalizedInput, 5);
  const isFinished = parsed.cursorIndex >= text.length;

  return { text, normalizedInput, parsed, isFinished };
}

describe("TypingStage 통합 시나리오", () => {
  it("Given 짧은 한 줄 가사, When 순서대로 정확히 입력, Then 완료 상태 + 모든 글자 correct", () => {
    const { parsed, isFinished } = simulateTypingFlow("hello", "hello");

    expect(isFinished).toBe(true);
    expect(parsed.states.every((s) => s === "correct")).toBe(true);
  });

  it("Given 공백 포함 한 줄 가사, When 정확히 입력, Then 완료", () => {
    const { parsed, isFinished } = simulateTypingFlow("ab cd", "ab cd");

    expect(isFinished).toBe(true);
    expect(parsed.states).toEqual([
      "correct", "correct", "correct", "correct", "correct",
    ]);
  });

  it("Given 여러 줄 가사, When Space로 줄바꿈하며 입력, Then 완료", () => {
    const { isFinished, normalizedInput } = simulateTypingFlow(
      "ab\ncd",
      "ab cd" // 라인 끝에서 Space → 줄바꿈, 이후 "cd"
    );

    expect(normalizedInput).toBe("ab\ncd");
    expect(isFinished).toBe(true);
  });

  it("Given 한글 가사, When 정확히 입력, Then 완료 + 모든 글자 correct", () => {
    const { parsed, isFinished } = simulateTypingFlow("안녕하세요", "안녕하세요");

    expect(isFinished).toBe(true);
    expect(parsed.states.every((s) => s === "correct")).toBe(true);
  });

  it("Given 오타 포함 입력, When 끝까지 입력, Then 완료 + wrong 포함", () => {
    const { parsed, isFinished } = simulateTypingFlow("abc", "axc");

    expect(isFinished).toBe(true);
    expect(parsed.states).toEqual(["correct", "wrong", "correct"]);
  });

  it("Given 부분 입력만 한 경우, When 중간까지만 입력, Then 미완료", () => {
    const { isFinished } = simulateTypingFlow("hello", "hel");

    expect(isFinished).toBe(false);
  });

  it("Given \\r\\n 개행 가사, When 정상 입력, Then \\n과 동일하게 완료", () => {
    const { isFinished, text } = simulateTypingFlow(
      "ab\r\ncd",
      "ab cd"
    );

    expect(text).toBe("ab\ncd"); // 정규화 확인
    expect(isFinished).toBe(true);
  });
});

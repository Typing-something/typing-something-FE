/**
 * 이 테스트가 없으면 재발하는 버그:
 * 리더보드 순위가 ranking_score 기준으로 정렬되지 않거나,
 * rank 번호가 잘못 부여되거나, 프로필 이미지 폴백이 누락되는 문제
 */
import { getRanking } from "@/lib/api/ranking";
import type { GetRankingResponse } from "@/types/ranking";

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const mockResponse = (body: GetRankingResponse, ok = true, status = 200) =>
  (globalThis.fetch as jest.Mock).mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });

const makeItem = (
  userId: number,
  score: number,
  overrides?: { profile_pic?: string }
) => ({
  account: {
    user_id: userId,
    username: `user${userId}`,
    email: `user${userId}@test.com`,
    profile_pic: overrides?.profile_pic ?? "",
    ranking_score: score,
  },
  rank: 0,
  stats: {
    avg_accuracy: 95,
    avg_cpm: 300,
    avg_wpm: 60,
    best_cpm: 350,
    best_wpm: 70,
    max_combo: 10,
    play_count: 5,
  },
});

describe("getRanking", () => {
  // --- 성공 응답 ---
  describe("성공 응답 가공", () => {
    it("Given ranking_score가 다른 3명, When 호출, Then score 내림차순으로 rank 부여", async () => {
      mockResponse({
        success: true,
        message: "ok",
        data: [
          makeItem(1, 100),
          makeItem(2, 300),
          makeItem(3, 200),
        ],
      });

      const result = await getRanking();

      expect(result[0].rank).toBe(1);
      expect(result[0].userId).toBe(2); // score 300
      expect(result[1].rank).toBe(2);
      expect(result[1].userId).toBe(3); // score 200
      expect(result[2].rank).toBe(3);
      expect(result[2].userId).toBe(1); // score 100
    });

    it("Given 응답 데이터, When 변환, Then Leader 타입 필드로 매핑", async () => {
      mockResponse({
        success: true,
        message: "ok",
        data: [makeItem(1, 100)],
      });

      const result = await getRanking();

      expect(result[0]).toEqual({
        userId: 1,
        rank: 1,
        name: "user1",
        handle: "@user1",
        imageUrl: "/profileNullImg.webp",
        wpm: 60,
        accuracy: 95,
        combo: 10,
      });
    });

    it("Given profile_pic이 있는 경우, When 변환, Then 해당 URL 사용", async () => {
      mockResponse({
        success: true,
        message: "ok",
        data: [makeItem(1, 100, { profile_pic: "https://img.com/pic.jpg" })],
      });

      const result = await getRanking();

      expect(result[0].imageUrl).toBe("https://img.com/pic.jpg");
    });

    it("Given profile_pic이 빈 문자열, When 변환, Then 기본 이미지 폴백", async () => {
      mockResponse({
        success: true,
        message: "ok",
        data: [makeItem(1, 100, { profile_pic: "" })],
      });

      const result = await getRanking();

      expect(result[0].imageUrl).toBe("/profileNullImg.webp");
    });

    it("Given data가 빈 배열, When 호출, Then 빈 배열 반환", async () => {
      mockResponse({
        success: true,
        message: "ok",
        data: [],
      });

      const result = await getRanking();

      expect(result).toEqual([]);
    });
  });

  // --- 실패 처리 ---
  describe("실패 시 에러 처리", () => {
    it("Given HTTP 에러 (res.ok=false), When 호출, Then 에러 throw", async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getRanking()).rejects.toThrow("Failed to fetch ranking: 500");
    });

    it("Given API success=false, When 호출, Then 에러 throw", async () => {
      mockResponse({
        success: false,
        message: "서버 오류",
        data: [],
      });

      await expect(getRanking()).rejects.toThrow("서버 오류");
    });
  });
});

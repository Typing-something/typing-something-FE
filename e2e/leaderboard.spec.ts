import { test, expect } from "@playwright/test";

test.describe("리더보드 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leaderboard");
  });

  test("Rankings 제목이 표시된다", async ({ page }) => {
    await expect(page.getByText("Rankings")).toBeVisible();
  });

  test("테이블 헤더(WPM, ACC)가 표시된다", async ({ page }) => {
    await expect(page.getByText("WPM")).toBeVisible();
    await expect(page.getByText("ACC")).toBeVisible();
  });

  test("랭킹 갱신 안내 문구가 표시된다", async ({ page }) => {
    await expect(page.getByText("랭킹은 10분마다 갱신됩니다")).toBeVisible();
  });

  test("순위 번호(#) 컬럼이 표시된다", async ({ page }) => {
    const hashCol = page.locator("div").filter({ hasText: /^#$/ }).first();
    await expect(hashCol).toBeVisible();
  });
});

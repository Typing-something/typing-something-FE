import { test, expect } from "@playwright/test";

test.describe("메인 페이지", () => {
  test("페이지가 정상적으로 로드된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("타이핑 입력창이 존재한다", async ({ page }) => {
    await page.goto("/");
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();
  });

  test("곡 제목과 아티스트가 표시된다", async ({ page }) => {
    await page.goto("/");
    // TypingBottomBar에 곡 메타 정보가 렌더링됨
    const bottomBar = page.locator("img[alt]").first();
    await expect(bottomBar).toBeVisible();
  });

  test("WPM, CPM, ACC 지표가 상단에 표시된다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("WPM")).toBeVisible();
    await expect(page.getByText("CPM")).toBeVisible();
    await expect(page.getByText("ACC")).toBeVisible();
  });

  test("설정 버튼을 누르면 사이드바가 열린다", async ({ page }) => {
    await page.goto("/");
    // 설정 버튼 클릭 (첫 번째 ariaLabel="설정" 버튼)
    await page.getByRole("button", { name: "설정" }).first().click();
    await expect(page.getByText("Typing Settings")).toBeVisible();
  });

  test("설정 사이드바를 닫으면 사라진다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "설정" }).first().click();
    await expect(page.getByText("Typing Settings")).toBeVisible();

    // 설정 사이드바 안의 닫기 버튼 클릭
    const sidebar = page.getByRole("complementary").filter({ hasText: "Typing Settings" });
    await sidebar.getByRole("button", { name: "닫기" }).click();
    await expect(page.getByText("Typing Settings")).not.toBeInViewport();
  });
});

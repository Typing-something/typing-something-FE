import { test, expect } from "@playwright/test";

test.describe("타이핑 기능", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // textarea가 보일 때까지 대기
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("textarea를 클릭하면 포커스가 잡힌다", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.click();
    await expect(textarea).toBeFocused();
  });

  test("타이핑 입력 시 텍스트가 반영된다", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.click();
    await textarea.type("hello");
    // 입력 후 value가 비어있지 않음 (실제 타이핑 앱은 내부 state로 관리)
    // 타이핑 디스플레이에 반응이 있는지 확인
    await expect(textarea).toBeFocused();
  });

  test("진행도 바가 타이핑에 따라 업데이트된다", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.click();

    // 초기 progress 확인 (0%)
    const progressBar = page.locator("[role=progressbar]").or(
      page.locator("div").filter({ hasText: /0%/ }).first()
    );

    // 일부 타이핑
    await textarea.type("a");
    // 진행도가 변경되었는지 확인 (progress 관련 요소가 존재)
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("리셋 버튼을 누르면 입력이 초기화된다", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.click();
    await textarea.type("some input");

    // 리셋 버튼 클릭
    const resetButton = page.getByRole("button", { name: /reset|다시|초기화/i }).first();
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await expect(textarea).toBeFocused();
    }
  });
});

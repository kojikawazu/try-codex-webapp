import { test, expect, devices } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("空状態からタスクを作成できる", async ({ page }) => {
  await expect(page.getByTestId("task-empty-state")).toBeVisible();

  await page.getByTestId("task-title-input").fill("要件整理");
  await page.getByTestId("task-description-input").fill("要件をまとめて優先度を付ける");
  await page.getByTestId("task-due-input").fill("2025-02-14");
  await page.getByTestId("task-priority-select").selectOption("high");
  await page.getByTestId("task-add-button").click();

  const card = page.getByTestId("task-card").filter({ hasText: "要件整理" });
  await expect(card).toBeVisible();
  await expect(page.getByTestId("summary-total")).toContainText("1");
  await expect(page.getByTestId("summary-active")).toContainText("1");
  await expect(page.getByTestId("summary-completed")).toContainText("0");
});

test("完了切り替えとフィルタが動作する", async ({ page }) => {
  await page.getByTestId("task-title-input").fill("資料作成");
  await page.getByTestId("task-add-button").click();

  await page.getByTestId("task-title-input").fill("レビュー対応");
  await page.getByTestId("task-add-button").click();

  const reviewCard = page
    .getByTestId("task-card")
    .filter({ hasText: "レビュー対応" });
  await reviewCard.getByTestId("task-toggle").click();

  await page.getByTestId("filter-completed").click();
  await expect(page.getByTestId("task-card")).toHaveCount(1);
  await expect(reviewCard).toBeVisible();

  await page.getByTestId("filter-active").click();
  await expect(page.getByTestId("task-card")).toHaveCount(1);
  await expect(page.getByTestId("task-card")).toContainText("資料作成");
});

test("インライン編集とバリデーション", async ({ page }) => {
  await page.getByTestId("task-title-input").fill("画面設計");
  await page.getByTestId("task-add-button").click();

  const card = page.getByTestId("task-card").first();
  await expect(card).toContainText("画面設計");
  await card.getByTestId("task-edit").click();

  await card.getByTestId("task-edit-title").fill("");
  await card.getByTestId("task-save").click();
  await expect(card.getByTestId("task-edit-error")).toBeVisible();

  await card.getByTestId("task-edit-title").fill("画面設計レビュー");
  await card.getByTestId("task-save").click();
  await expect(card).toContainText("画面設計レビュー");
});

test("リロード後もタスクが保持される", async ({ page }) => {
  await page.getByTestId("task-title-input").fill("永続化確認");
  await page.getByTestId("task-add-button").click();

  await page.reload();
  await expect(page.getByTestId("task-card")).toContainText("永続化確認");
});

test.use({ ...devices["iPhone 14"] });

test("モバイル表示でも主要要素が見える", async ({ page }) => {
  await expect(page.getByTestId("task-form")).toBeVisible();
  await expect(page.getByTestId("task-empty-state")).toBeVisible();
});

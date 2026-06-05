import { test, expect } from '@playwright/test';

test.describe('画室排课画布 - 冲突拖拽验证', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.schedule-canvas');
    await page.evaluate(() => {
      localStorage.removeItem('studio_scheduler_state');
    });
    await page.reload();
    await page.waitForSelector('.schedule-canvas');
  });

  test('正常拖拽课程到空格子应成功落位', async ({ page }) => {
    const courseCard = page.locator('[data-testid="course-card-c1"]');
    const targetCell = page.locator('[data-testid="cell-r1-ts1"]');

    await expect(targetCell.locator('.schedule-block')).toHaveCount(0);

    await courseCard.dragTo(targetCell);

    await expect(targetCell.locator('.schedule-block')).toHaveCount(1);
    const block = targetCell.locator('.schedule-block');
    await expect(block).toContainText('素描基础');
  });

  test('教师时间冲突 - 同一教师同时段不同教室应回弹', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');
    const cellR2Ts1 = page.locator('[data-testid="cell-r2-ts1"]');

    await courseC1.dragTo(cellR1Ts1);
    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(1);

    const courseC7 = page.locator('[data-testid="course-card-c7"]');
    await courseC7.dragTo(cellR2Ts1);

    await expect(page.locator('[data-testid="conflict-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="conflict-alert"]')).toContainText('教师此时段已有课程');

    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(0);
  });

  test('拖拽已有课程到教师冲突位置应回弹且原位保留', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const courseC7 = page.locator('[data-testid="course-card-c7"]');

    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');
    const cellR2Ts1 = page.locator('[data-testid="cell-r2-ts1"]');
    const cellR3Ts1 = page.locator('[data-testid="cell-r3-ts1"]');

    await courseC1.dragTo(cellR1Ts1);
    await courseC7.dragTo(cellR2Ts1);

    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(1);
    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(1);

    const blockInR2 = cellR2Ts1.locator('.schedule-block');
    await blockInR2.dragTo(cellR3Ts1);

    await expect(page.locator('[data-testid="conflict-alert"]')).toBeVisible();
    await expect(cellR3Ts1.locator('.schedule-block')).toHaveCount(0);
    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(1);
  });

  test('材料未备齐课程显示黄色提示', async ({ page }) => {
    const courseC2 = page.locator('[data-testid="course-card-c2"]');
    const cellR2Ts2 = page.locator('[data-testid="cell-r2-ts2"]');

    await courseC2.dragTo(cellR2Ts2);

    const block = cellR2Ts2.locator('.schedule-block');
    await expect(block).toHaveCount(1);
    await expect(block).toHaveClass(/material-warning/);
    await expect(block.locator('.material-warning-tag')).toBeVisible();
  });

  test('家长角色不能拖拽课程', async ({ page }) => {
    await page.locator('[data-testid="role-parent"]').click();

    const courseCard = page.locator('[data-testid="course-card-c1"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseCard.dragTo(cellR1Ts1);

    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(0);
  });

  test('已落位格子不能再放入课程', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const courseC2 = page.locator('[data-testid="course-card-c2"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseC1.dragTo(cellR1Ts1);
    await courseC2.dragTo(cellR1Ts1);

    const blocks = cellR1Ts1.locator('.schedule-block');
    await expect(blocks).toHaveCount(1);
    await expect(blocks.first()).toContainText('素描基础');
  });

  test('管理员可切换材料准备状态', async ({ page }) => {
    const courseC2 = page.locator('[data-testid="course-card-c2"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseC2.dragTo(cellR1Ts1);

    const block = cellR1Ts1.locator('.schedule-block');
    await expect(block).toHaveClass(/material-warning/);

    await block.locator('.material-toggle-btn').click();

    await expect(block).not.toHaveClass(/material-warning/);
  });

  test('侧边详情面板点击后显示', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseC1.dragTo(cellR1Ts1);

    const block = cellR1Ts1.locator('.schedule-block');
    await block.click();

    const detailPanel = page.locator('.detail-panel');
    await expect(detailPanel).toContainText('素描基础');
    await expect(detailPanel).toContainText('王老师');
    await expect(detailPanel).toContainText('素描教室');
  });
});

import { test, expect } from '@playwright/test';

test.describe('画室排课画布 - 冲突拖拽验证', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.schedule-canvas', { state: 'visible' });
    await page.evaluate(() => {
      localStorage.removeItem('studio_scheduler_state');
    });
    await page.reload();
    await page.waitForSelector('.schedule-canvas', { state: 'visible' });
  });

  async function injectFullClass(page, timeslotId, classroomId) {
    await page.evaluate(([ts, rm]) => {
      const state = {
        schedule: [{
        id: 'full-class-' + Date.now(),
        courseId: 'c1',
        classroomId: rm,
        timeslotId: ts,
        teacherId: 't99',
        name: '满班课程（测试）',
        isTrial: false,
        maxStudents: 12,
        materials: ['铅笔', '素描纸'],
        materialsReady: true,
        currentStudents: 12,
      }],
      role: 'admin',
      courseTemplates: JSON.parse(JSON.stringify([
        { id: 'c1', name: '素描基础', teacherId: 't1', maxStudents: 12, isTrial: false, materials: ['铅笔', '素描纸', '橡皮'], materialsReady: true, duration: 1 },
        { id: 'c2', name: '水彩入门', teacherId: 't2', maxStudents: 10, isTrial: false, materials: ['水彩颜料', '水彩纸', '画笔', '调色盘'], materialsReady: false, duration: 1 },
        { id: 'c3', name: '油画进阶', teacherId: 't3', maxStudents: 8, isTrial: false, materials: ['油画颜料', '画布', '松节油', '画笔'], materialsReady: true, duration: 1 },
        { id: 'c4', name: '国画写意', teacherId: 't4', maxStudents: 10, isTrial: false, materials: ['毛笔', '宣纸', '墨汁', '颜料'], materialsReady: false, duration: 1 },
        { id: 'c5', name: '素描体验课', teacherId: 't1', maxStudents: 12, isTrial: true, materials: ['铅笔', '素描纸'], materialsReady: true, duration: 1 },
        { id: 'c6', name: '水彩体验课', teacherId: 't2', maxStudents: 10, isTrial: true, materials: ['水彩颜料', '水彩纸'], materialsReady: true, duration: 1 },
        { id: 'c7', name: '创意手工', teacherId: 't1', maxStudents: 10, isTrial: false, materials: ['彩纸', '剪刀', '胶水'], materialsReady: true, duration: 1 },
        { id: 'c8', name: '油画体验课', teacherId: 't3', maxStudents: 8, isTrial: true, materials: ['油画颜料', '画布'], materialsReady: false, duration: 1 },
      ])),
    };
    localStorage.setItem('studio_scheduler_state', JSON.stringify(state));
  }, [timeslotId, classroomId]);
    await page.reload();
    await page.waitForSelector('.schedule-canvas', { state: 'visible' });
  }

  test('正常拖拽课程到空格子应成功落位', async ({ page }) => {
    const courseCard = page.locator('[data-testid="course-card-c1"]');
    const targetCell = page.locator('[data-testid="cell-r1-ts1"]');

    await expect(targetCell.locator('.schedule-block')).toHaveCount(0);

    await courseCard.hover();
    await page.mouse.down();
    await targetCell.hover();
    await page.mouse.up();

    await expect(targetCell.locator('.schedule-block')).toHaveCount(1);
    const block = targetCell.locator('.schedule-block');
    await expect(block).toContainText('素描基础');
  });

  test('教师时间冲突 - 同一教师同时段不同教室应回弹', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');
    const cellR2Ts1 = page.locator('[data-testid="cell-r2-ts1"]');

    await courseC1.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();
    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(1);

    const courseC7 = page.locator('[data-testid="course-card-c7"]');
    await courseC7.hover();
    await page.mouse.down();
    await cellR2Ts1.hover();
    await page.mouse.up();

    await expect(page.locator('[data-testid="conflict-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="conflict-alert"]')).toContainText('教师此时段已有课程');

    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(0);
  });

  test('试听课不能排到已有满班课程的时段', async ({ page }) => {
    await injectFullClass(page, 'ts1', 'r1');

    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');
    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(1);
    await expect(cellR1Ts1).toContainText('满班课程');

    const trialCourse = page.locator('[data-testid="course-card-c5"]');
    const cellR2Ts1 = page.locator('[data-testid="cell-r2-ts1"]');

    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(0);

    await trialCourse.hover();
    await page.mouse.down();
    await cellR2Ts1.hover();
    await page.mouse.up();

    await expect(page.locator('[data-testid="conflict-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="conflict-alert"]')).toContainText('试听课不能排到已有满班课程的时段');

    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(0);
  });

  test('非试听课可以排到有满班课程的时段（不同教师）', async ({ page }) => {
    await injectFullClass(page, 'ts1', 'r1');

    const normalCourse = page.locator('[data-testid="course-card-c2"]');
    const cellR2Ts1 = page.locator('[data-testid="cell-r2-ts1"]');

    await normalCourse.hover();
    await page.mouse.down();
    await cellR2Ts1.hover();
    await page.mouse.up();

    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(1);
    await expect(cellR2Ts1).toContainText('水彩入门');
  });

  test('拖拽已有课程到教师冲突位置应回弹且原位保留', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const courseC7 = page.locator('[data-testid="course-card-c7"]');

    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');
    const cellR2Ts1 = page.locator('[data-testid="cell-r2-ts1"]');
    const cellR3Ts1 = page.locator('[data-testid="cell-r3-ts1"]');

    await courseC1.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();

    await courseC7.hover();
    await page.mouse.down();
    await cellR2Ts1.hover();
    await page.mouse.up();

    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(1);
    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(1);

    const blockInR2 = cellR2Ts1.locator('.schedule-block');
    await blockInR2.hover();
    await page.mouse.down();
    await cellR3Ts1.hover();
    await page.mouse.up();

    await expect(page.locator('[data-testid="conflict-alert"]')).toBeVisible();
    await expect(cellR3Ts1.locator('.schedule-block')).toHaveCount(0);
    await expect(cellR2Ts1.locator('.schedule-block')).toHaveCount(1);
  });

  test('材料未备齐课程显示黄色提示', async ({ page }) => {
    const courseC2 = page.locator('[data-testid="course-card-c2"]');
    const cellR2Ts2 = page.locator('[data-testid="cell-r2-ts2"]');

    await courseC2.hover();
    await page.mouse.down();
    await cellR2Ts2.hover();
    await page.mouse.up();

    const block = cellR2Ts2.locator('.schedule-block');
    await expect(block).toHaveCount(1);
    await expect(block).toHaveClass(/material-warning/);
    await expect(block.locator('.material-warning-tag')).toBeVisible();
  });

  test('家长角色不能拖拽课程', async ({ page }) => {
    await page.locator('[data-testid="role-parent"]').click();

    const courseCard = page.locator('[data-testid="course-card-c1"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseCard.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();

    await expect(cellR1Ts1.locator('.schedule-block')).toHaveCount(0);
  });

  test('已落位格子不能再放入课程', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const courseC2 = page.locator('[data-testid="course-card-c2"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseC1.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();

    await courseC2.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();

    const blocks = cellR1Ts1.locator('.schedule-block');
    await expect(blocks).toHaveCount(1);
    await expect(blocks.first()).toContainText('素描基础');
  });

  test('管理员可切换材料准备状态', async ({ page }) => {
    const courseC2 = page.locator('[data-testid="course-card-c2"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseC2.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();

    const block = cellR1Ts1.locator('.schedule-block');
    await expect(block).toHaveClass(/material-warning/);

    await block.locator('.material-toggle-btn').click();

    await expect(block).not.toHaveClass(/material-warning/);
  });

  test('侧边详情面板点击后显示', async ({ page }) => {
    const courseC1 = page.locator('[data-testid="course-card-c1"]');
    const cellR1Ts1 = page.locator('[data-testid="cell-r1-ts1"]');

    await courseC1.hover();
    await page.mouse.down();
    await cellR1Ts1.hover();
    await page.mouse.up();

    const block = cellR1Ts1.locator('.schedule-block');
    await block.click();

    const detailPanel = page.locator('.detail-panel');
    await expect(detailPanel).toContainText('素描基础');
    await expect(detailPanel).toContainText('王老师');
    await expect(detailPanel).toContainText('素描教室');
  });
});

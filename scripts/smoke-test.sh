#!/bin/bash
set -euo pipefail

echo "=== 画室排课画布 - Docker 冒烟测试 ==="

BASE_URL="${BASE_URL:-http://localhost:3000}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "[1/4] 检查服务可达性 ..."
for i in $(seq 1 30); do
  if curl -sf "${BASE_URL}/health" > /dev/null 2>&1; then
    echo "  ✅ 服务已就绪 (${BASE_URL})"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  ❌ 服务启动超时"
    exit 1
  fi
  sleep 2
done

echo "[2/4] 检查页面加载 ..."
HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/")
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ 页面返回 200"
else
  echo "  ❌ 页面返回 ${HTTP_CODE}"
  exit 1
fi

echo "[3/4] 检查测试环境 ..."
if [ ! -d "node_modules" ] || [ ! -d "node_modules/@playwright" ]; then
  echo "  安装 npm 依赖 ..."
  npm ci --no-audit --no-fund
fi

if ! npx --yes playwright install --with-deps chromium 2>&1; then
  echo "  ⚠️ Playwright 浏览器安装可能不完整，继续尝试运行测试..."
fi

echo "[4/4] 运行 Playwright 冲突拖拽测试 ..."
set +e
npx playwright test e2e/conflict-drag.spec.js \
  --reporter=list \
  --timeout=60000 \
  2>&1
TEST_EXIT=$?
set -e

if [ $TEST_EXIT -eq 0 ]; then
  echo ""
  echo "========================================="
  echo "  ✅ 所有冒烟测试通过"
  echo "  - 教师时间冲突拖拽回弹不落位 ✅"
  echo "  - 试听课满班拦截成功 ✅"
  echo "  - 材料未备齐黄色提示 ✅"
  echo "  - 角色权限控制正确 ✅"
  echo "  - 课程块可正确拖拽落位 ✅"
  echo "========================================="
  exit 0
else
  echo ""
  echo "========================================="
  echo "  ❌ 冒烟测试失败 (退出码: ${TEST_EXIT})"
  echo "========================================="
  exit 1
fi

#!/bin/bash
set -euo pipefail

echo "=== 画室排课画布 - Docker 冒烟测试 ==="

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "[1/3] 检查服务可达性 ..."
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

echo "[2/3] 检查页面加载 ..."
HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/")
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ 页面返回 200"
else
  echo "  ❌ 页面返回 ${HTTP_CODE}"
  exit 1
fi

echo "[3/3] 运行 Playwright 冲突拖拽测试 ..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

if [ ! -d "node_modules/.bin" ]; then
  echo "  安装依赖 ..."
  npm ci
fi

if ! npx playwright install chromium 2>/dev/null; then
  echo "  ⚠️ Playwright 浏览器安装失败，尝试直接运行..."
fi

npx playwright test e2e/conflict-drag.spec.js --reporter=list 2>&1
TEST_EXIT=$?

if [ $TEST_EXIT -eq 0 ]; then
  echo ""
  echo "========================================="
  echo "  ✅ 所有冒烟测试通过"
  echo "  - 冲突拖拽不会落位 ✅"
  echo "  - 材料未备齐黄色提示 ✅"
  echo "  - 试听课满班拦截 ✅"
  echo "  - 角色权限正确 ✅"
  echo "========================================="
else
  echo ""
  echo "========================================="
  echo "  ❌ 冒烟测试失败"
  echo "========================================="
  exit 1
fi

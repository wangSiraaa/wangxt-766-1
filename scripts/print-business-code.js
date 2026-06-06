#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '../src/data/seed-766.json');

try {
  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  console.log('业务编号:', seedData.businessCode);
  console.log('种子名称:', seedData.seedName);
  console.log('排课数量:', seedData.initialSchedule.length);
  process.exit(0);
} catch (error) {
  console.error('读取 seed-766.json 失败:', error.message);
  process.exit(1);
}

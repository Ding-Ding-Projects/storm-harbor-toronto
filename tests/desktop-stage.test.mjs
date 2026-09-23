import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { stageDesktopRuntime } from '../scripts/desktop-stage.mjs';

test('desktop staging excludes an ignored private Electron log', async () => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-harbor-stage-test-'));
  const root = path.join(temporaryRoot, 'source');
  const stage = path.join(temporaryRoot, 'stage');
  try {
    await fs.mkdir(path.join(root, 'dist'), { recursive: true });
    await fs.mkdir(path.join(root, 'electron'));
    await fs.mkdir(stage);
    await fs.writeFile(path.join(root, 'dist', 'index.html'), '<main>runtime</main>');
    await fs.writeFile(path.join(root, 'electron', 'main.cjs'), 'module.exports = {};');
    await fs.writeFile(path.join(root, 'electron', 'private.log'), 'benign local runtime log');
    const icon = path.join(root, 'app.ico');
    await fs.writeFile(icon, 'icon fixture');

    await stageDesktopRuntime(root, stage, icon);

    assert.equal(await fs.readFile(path.join(stage, 'electron', 'main.cjs'), 'utf8'), 'module.exports = {};');
    assert.equal(await fs.readFile(path.join(stage, 'dist', 'index.html'), 'utf8'), '<main>runtime</main>');
    assert.equal(await fs.readFile(path.join(stage, 'assets', 'storm-harbor.ico'), 'utf8'), 'icon fixture');
    await assert.rejects(fs.access(path.join(stage, 'electron', 'private.log')), { code: 'ENOENT' });
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
});

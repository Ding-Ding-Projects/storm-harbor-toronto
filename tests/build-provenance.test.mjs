import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

test('build provenance reads this checkout when invoked from another directory', async () => {
  const foreignDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-harbor-provenance-test-'));
  try {
    const configUrl = new URL('../vite.config.ts', import.meta.url).href;
    const source = `import config from ${JSON.stringify(configUrl)}; process.stdout.write(config.define.__BUILD_INFO__)`;
    const output = execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', source], {
      cwd: foreignDirectory,
      encoding: 'utf8'
    });
    const actual = JSON.parse(output);
    const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    const clean = execFileSync('git', ['status', '--porcelain', '--', '.', ':(exclude)dist'], { cwd: root, encoding: 'utf8' }).trim().length === 0;
    assert.equal(actual.sourceRevision, revision);
    assert.equal(actual.sourceTreeClean, clean);
  } finally {
    await fs.rm(foreignDirectory, { recursive: true, force: true });
  }
});

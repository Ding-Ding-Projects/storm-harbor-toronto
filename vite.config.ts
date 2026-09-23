import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));
const packageInfo = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };
const builtAt = new Date();
const buildInfo = {
  version: packageInfo.version,
  builtAt: builtAt.toISOString(),
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: projectDirectory, encoding: 'utf8' }).trim(),
  sourceTreeClean: execFileSync('git', ['status', '--porcelain', '--', '.', ':(exclude)dist'], { cwd: projectDirectory, encoding: 'utf8' }).trim().length === 0
};

export default defineConfig({
  base: './',
  define: { __BUILD_INFO__: JSON.stringify(buildInfo) },
  build: {
    target: 'es2022',
    rollupOptions: {
      plugins: [{
        name: 'storm-harbor-build-provenance',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'build-info.json',
            source: JSON.stringify(buildInfo, null, 2)
          });
        }
      }]
    }
  }
});

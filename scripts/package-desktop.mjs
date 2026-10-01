import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import packager from '@electron/packager';
import { createWindowsInstaller } from 'electron-winstaller';
import { stageDesktopRuntime } from './desktop-stage.mjs';

const root = path.resolve(import.meta.dirname, '..');
const rootPackage = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const version = rootPackage.version;
if (typeof version !== 'string' || !/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(version)) {
  throw new Error('Root package.json must contain a stable three-component version');
}
if (typeof rootPackage.name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(rootPackage.name)) {
  throw new Error('Root package.json must contain a lowercase package name');
}
const output = path.join(root, 'release', 'windows', `v${version}`);
const icon = path.join(root, 'assets', 'storm-harbor.ico');
const electronVersion = JSON.parse(await fs.readFile(path.join(root, 'node_modules', 'electron', 'package.json'), 'utf8')).version;
const stage = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-harbor-desktop-'));
try {
  // Stage only the declared runtime entry point, built bundle, and application icon.
  await stageDesktopRuntime(root, stage, icon);
  await fs.writeFile(path.join(stage, 'package.json'), JSON.stringify({
    name: rootPackage.name,
    productName: 'Storm Harbor Toronto',
    version,
    description: 'A calm live lightning map for Toronto',
    author: 'Storm Harbor Toronto',
    main: 'electron/main.cjs'
  }, null, 2));
  const [appDirectory] = await packager({
    dir: stage,
    out: path.join(root, 'out'),
    name: 'StormHarborToronto',
    platform: 'win32',
    arch: 'x64',
    electronVersion,
    overwrite: true,
    icon,
    asar: true,
    prune: false
  });
  await fs.mkdir(output, { recursive: true });
  for (const name of ['StormHarborTorontoSetup.exe', `${rootPackage.name}-${version}-full.nupkg`, 'RELEASES']) {
    await fs.rm(path.join(output, name), { force: true });
  }
  await createWindowsInstaller({
    appDirectory,
    outputDirectory: output,
    authors: 'Storm Harbor Toronto',
    exe: 'StormHarborToronto.exe',
    description: 'A calm live lightning map for Toronto',
    setupExe: 'StormHarborTorontoSetup.exe',
    setupIcon: icon,
    noMsi: true
  });
  console.log(`Unsigned Squirrel.Windows installer written to release/windows/v${version}`);
} finally {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const resolvedStage = await fs.realpath(stage);
  if (!resolvedStage.startsWith(`${temporaryRoot}${path.sep}`) || path.basename(resolvedStage).startsWith('storm-harbor-desktop-') === false) {
    throw new Error('Refusing to remove a staging directory outside the owned temporary root');
  }
  await fs.rm(resolvedStage, { recursive: true, force: true });
}

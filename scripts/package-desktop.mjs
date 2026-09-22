import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import packager from '@electron/packager';
import { createWindowsInstaller } from 'electron-winstaller';

const root = path.resolve(import.meta.dirname, '..');
const stage = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-harbor-desktop-'));
const output = path.join(root, 'release', 'windows');
const icon = path.join(root, 'assets', 'storm-harbor.ico');
const electronVersion = JSON.parse(await fs.readFile(path.join(root, 'node_modules', 'electron', 'package.json'), 'utf8')).version;
try {
  // Only the runtime bundle and icon enter the installer. Source and old releases stay out.
  await fs.cp(path.join(root, 'dist'), path.join(stage, 'dist'), { recursive: true });
  await fs.cp(path.join(root, 'electron'), path.join(stage, 'electron'), { recursive: true });
  await fs.mkdir(path.join(stage, 'assets'));
  await fs.copyFile(icon, path.join(stage, 'assets', 'storm-harbor.ico'));
  await fs.writeFile(path.join(stage, 'package.json'), JSON.stringify({
    name: 'storm-harbor-toronto',
    productName: 'Storm Harbor Toronto',
    version: '0.1.0',
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
  for (const name of ['StormHarborTorontoSetup.exe', 'storm-harbor-toronto-0.1.0-full.nupkg', 'RELEASES']) {
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
  console.log('Unsigned Squirrel.Windows installer written to release/windows');
} finally {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const resolvedStage = await fs.realpath(stage);
  if (!resolvedStage.startsWith(`${temporaryRoot}${path.sep}`) || path.basename(resolvedStage).startsWith('storm-harbor-desktop-') === false) {
    throw new Error('Refusing to remove a staging directory outside the owned temporary root');
  }
  await fs.rm(resolvedStage, { recursive: true, force: true });
}

import path from 'node:path';
import { createWindowsInstaller } from 'electron-winstaller';

const root = path.resolve(import.meta.dirname, '..');
await createWindowsInstaller({
  appDirectory: path.join(root, 'out', 'StormHarborToronto-win32-x64'),
  outputDirectory: path.join(root, 'release', 'windows'),
  authors: 'Storm Harbor Toronto',
  exe: 'StormHarborToronto.exe',
  description: 'A calm live lightning map for Toronto',
  setupExe: 'StormHarborTorontoSetup.exe',
  setupIcon: path.join(root, 'assets', 'storm-harbor.ico'),
  noMsi: true
});
console.log('Unsigned Squirrel.Windows installer written to release/windows');

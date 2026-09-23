import fs from 'node:fs/promises';
import path from 'node:path';

export async function stageDesktopRuntime(root, stage, icon) {
  await fs.cp(path.join(root, 'dist'), path.join(stage, 'dist'), { recursive: true });
  await fs.mkdir(path.join(stage, 'electron'));
  await fs.copyFile(path.join(root, 'electron', 'main.cjs'), path.join(stage, 'electron', 'main.cjs'));
  await fs.mkdir(path.join(stage, 'assets'));
  await fs.copyFile(icon, path.join(stage, 'assets', 'storm-harbor.ico'));
}

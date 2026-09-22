import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const androidRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(androidRoot);
const svg = await fs.readFile(path.join(repoRoot, 'design', 'storm-harbor.svg'), 'utf8');
const artwork = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1];
if (!artwork) throw new Error('Storm Harbor SVG cannot be embedded in the Android splash image');
const resRoot = path.join(androidRoot, 'app', 'src', 'main', 'res');

for (const [density, size] of Object.entries({ mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 })) {
  const folder = path.join(resRoot, `mipmap-${density}`);
  await fs.mkdir(folder, { recursive: true });
  const icon = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  await fs.writeFile(path.join(folder, 'ic_launcher.png'), icon);
  await fs.writeFile(path.join(folder, 'ic_launcher_round.png'), icon);
  const foreground = new Resvg(svg, { fitTo: { mode: 'width', value: Math.round(size * 2.25) } }).render().asPng();
  await fs.writeFile(path.join(folder, 'ic_launcher_foreground.png'), foreground);
}

for (const [variant, width, height] of [
  ['drawable', 480, 320],
  ['drawable-land-mdpi', 480, 320],
  ['drawable-land-hdpi', 800, 480],
  ['drawable-land-xhdpi', 1280, 720],
  ['drawable-land-xxhdpi', 1600, 960],
  ['drawable-land-xxxhdpi', 1920, 1280],
  ['drawable-port-mdpi', 320, 480],
  ['drawable-port-hdpi', 480, 800],
  ['drawable-port-xhdpi', 720, 1280],
  ['drawable-port-xxhdpi', 960, 1600],
  ['drawable-port-xxxhdpi', 1280, 1920]
]) {
  const mark = Math.round(Math.min(width, height) * 0.34);
  const x = Math.round((width - mark) / 2);
  const y = Math.round((height - mark) / 2);
  const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f5f9f9"/><g transform="translate(${x} ${y}) scale(${mark / 512})">${artwork}</g></svg>`;
  const folder = path.join(resRoot, variant);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, 'splash.png'), new Resvg(splash).render().asPng());
}

console.log('Generated Android launcher and splash images from the original Storm Harbor SVG.');

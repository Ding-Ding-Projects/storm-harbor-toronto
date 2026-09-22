import fs from 'node:fs/promises';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const root = path.resolve(import.meta.dirname, '..');
const svg = await fs.readFile(path.join(root, 'design', 'storm-harbor.svg'));
const sizes = [16, 24, 32, 48, 64, 128, 256];
const pngs = sizes.map(size => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng());
await fs.mkdir(path.join(root, 'assets'), { recursive: true });
await fs.mkdir(path.join(root, 'public'), { recursive: true });
await fs.writeFile(path.join(root, 'assets', 'storm-harbor.ico'), await pngToIco(pngs));
await fs.writeFile(path.join(root, 'public', 'icon.png'), pngs.at(-1));
console.log('Built original 7-size Windows icon and web icon.');

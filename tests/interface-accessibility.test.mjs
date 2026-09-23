import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hideDecorativeLocationIcon, selectedLocationMarkerOptions } from '../src/locationMarker.ts';

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

test('dark-theme build label meets normal-text contrast', async () => {
  const [styles, buildInfo] = await Promise.all([
    fs.readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/build-info.css', import.meta.url), 'utf8')
  ]);
  const background = styles.match(/@media\(prefers-color-scheme:dark\)\{:root\{background:(#[\da-f]{6})/i)?.[1];
  const foreground = buildInfo.match(/@media\(prefers-color-scheme:dark\)\{\.build-info\{color:(#[\da-f]{6})/i)?.[1];
  assert.ok(background, 'dark theme background is declared');
  assert.ok(foreground, 'dark theme build label foreground is declared');
  const values = [luminance(background), luminance(foreground)].sort((a, b) => b - a);
  assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5);
});

test('selected location icon is noninteractive and hidden from accessibility output', () => {
  assert.equal(selectedLocationMarkerOptions.interactive, false);
  assert.equal(selectedLocationMarkerOptions.keyboard, false);
  const attributes = new Map();
  hideDecorativeLocationIcon({ setAttribute: (name, value) => attributes.set(name, value) });
  assert.equal(attributes.get('aria-hidden'), 'true');
  assert.equal(attributes.get('role'), 'presentation');
  assert.doesNotThrow(() => hideDecorativeLocationIcon(undefined));
});

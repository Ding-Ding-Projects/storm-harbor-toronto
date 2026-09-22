import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasTiffHeader, thunderInNextThreeHours } from '../src/lightning.ts';

test('accepts normal little-endian GeoTIFF header', () => assert.equal(hasTiffHeader(Uint8Array.from([0x49, 0x49, 0x2a, 0x00]).buffer), true));
test('accepts big-endian TIFF header', () => assert.equal(hasTiffHeader(Uint8Array.from([0x4d, 0x4d, 0x00, 0x2a]).buffer), true));
test('rejects XML error response with HTTP 200', () => assert.equal(hasTiffHeader(new TextEncoder().encode('<ServiceException/>').buffer), false));
test('keeps next three hours across UTC midnight', () => {
  const now = Date.parse('2026-09-22T22:30:00Z');
  assert.equal(thunderInNextThreeHours(['2026-09-22T22:00', '2026-09-23T00:00'], [0, 95], now), true);
});
test('does not count past thunderstorm hours as future', () => {
  const now = Date.parse('2026-09-22T22:30:00Z');
  assert.equal(thunderInNextThreeHours(['2026-09-22T22:00', '2026-09-23T00:00'], [95, 0], now), false);
});

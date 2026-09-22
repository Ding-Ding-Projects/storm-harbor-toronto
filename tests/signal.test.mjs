import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseSignal } from '../src/signal.ts';

const reading = nearestKm => ({ latest: '2026-09-22T19:40:00Z', frames: [], nearestKm, activeCells: nearestKm === null ? 0 : 1, fresh: true });

test('heard thunder takes precedence even without network data', () => assert.equal(chooseSignal(null, null, true), 'red'));
test('30 km boundary is red', () => assert.equal(chooseSignal(reading(30), false, false), 'red'));
test('beyond 30 km is yellow', () => assert.equal(chooseSignal(reading(30.01), false, false), 'yellow'));
test('60 km boundary is yellow', () => assert.equal(chooseSignal(reading(60), false, false), 'yellow'));
test('beyond 60 km with full valid data is green', () => assert.equal(chooseSignal(reading(60.01), false, false), 'green'));
test('forecast thunderstorms make an observed-clear signal yellow', () => assert.equal(chooseSignal(reading(null), true, false), 'yellow'));
test('missing observations do not make a forecast-only yellow claim', () => assert.equal(chooseSignal(null, true, false), 'unknown'));
test('missing forecast does not make a green claim', () => assert.equal(chooseSignal(reading(null), null, false), 'unknown'));
test('stale observations do not make a green claim', () => assert.equal(chooseSignal({ ...reading(null), fresh: false }, false, false), 'unknown'));

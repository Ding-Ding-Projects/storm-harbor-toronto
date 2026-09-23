import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatBuildTimestamp } from '../src/buildInfo.ts';

const unavailable = 'Build time unavailable';

test('formats the build timestamp in the named time zone', () => {
  const result = formatBuildTimestamp('2026-09-23T08:00:00.000Z', 'UTC', 'en-CA', unavailable);
  assert.match(result, /\(UTC\)$/);
  assert.notEqual(result, unavailable);
});

test('uses the fallback for an invalid build timestamp', () => {
  assert.equal(formatBuildTimestamp('not-a-date', 'UTC', 'en-CA', unavailable), unavailable);
});

test('uses the fallback when the time zone is missing', () => {
  assert.equal(formatBuildTimestamp('2026-09-23T08:00:00.000Z', '', 'en-CA', unavailable), unavailable);
});

test('uses the fallback instead of throwing for an invalid time zone', () => {
  assert.equal(formatBuildTimestamp('2026-09-23T08:00:00.000Z', 'Invalid/Timezone', 'en-CA', unavailable), unavailable);
});

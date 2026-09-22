import type { LightningReading } from './lightning';

export type Signal = 'red' | 'yellow' | 'green' | 'unknown';

export function chooseSignal(reading: LightningReading | null, forecast: boolean | null, thunderActive: boolean): Signal {
  if (thunderActive) return 'red';
  if (!reading?.fresh) return 'unknown';
  if (reading.nearestKm !== null && reading.nearestKm <= 30) return 'red';
  if (reading.nearestKm !== null && reading.nearestKm <= 60) return 'yellow';
  if (forecast === true) return 'yellow';
  if (forecast === null) return 'unknown';
  return 'green';
}

import { fromArrayBuffer } from 'geotiff';

export type Point = { lat: number; lon: number };
export type LightningReading = {
  latest: string;
  frames: string[];
  nearestKm: number | null;
  activeCells: number;
  fresh: boolean;
};

const SOURCE = 'https://geo.weather.gc.ca/geomet';
const LAYER = 'Lightning_2.5km_Density';

export function distanceKm(a: Point, b: Point): number {
  const radians = Math.PI / 180;
  const dLat = (b.lat - a.lat) * radians;
  const dLon = (b.lon - a.lon) * radians;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * radians) * Math.cos(b.lat * radians) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function directChild(element: Element, name: string): Element | undefined {
  return Array.from(element.children).find(child => child.localName === name);
}

export async function availableFrames(signal?: AbortSignal): Promise<string[]> {
  const url = `${SOURCE}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&LAYERS=${LAYER}`;
  const response = await fetch(url, { signal, cache: 'default' });
  if (!response.ok) throw new Error(`GeoMet capabilities: HTTP ${response.status}`);
  const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
  if (xml.querySelector('parsererror')) throw new Error('GeoMet capabilities could not be read');
  const layer = Array.from(xml.getElementsByTagName('*')).find(node =>
    node.localName === 'Layer' && directChild(node, 'Name')?.textContent === LAYER
  );
  const dimension = layer && Array.from(layer.children).find(node => node.localName === 'Dimension' && node.getAttribute('name') === 'time');
  const latest = dimension?.getAttribute('default');
  if (!latest || Number.isNaN(Date.parse(latest))) throw new Error('GeoMet has no valid latest observation time');
  const range = dimension?.textContent?.trim().split('/');
  if (!range || range.length !== 3 || range[2] !== 'PT10M' || Number.isNaN(Date.parse(range[0])) || Number.isNaN(Date.parse(range[1]))) {
    throw new Error('GeoMet observation interval is incomplete');
  }
  const frames = [0, 1, 2].map(index => new Date(Date.parse(latest) - index * 600000).toISOString().replace('.000Z', 'Z'));
  if (frames.some(frame => Date.parse(frame) < Date.parse(range[0]) || Date.parse(frame) > Date.parse(range[1]))) {
    throw new Error('GeoMet does not provide three recent observation frames');
  }
  return frames;
}

export async function readLightning(point: Point, signal?: AbortSignal): Promise<LightningReading> {
  const frames = await availableFrames(signal);
  const latest = frames[0];
  const age = Date.now() - Date.parse(latest);
  const fresh = age >= 0 && age <= 20 * 60000;
  if (!fresh) return { latest, frames, nearestKm: null, activeCells: 0, fresh: false };

  // Request one compact coverage per observation. Each is a 65 km radius around the selected point.
  const latRadius = 65 / 111.2;
  const lonRadius = 65 / (111.2 * Math.cos(point.lat * Math.PI / 180));
  const extent = new URLSearchParams({
    SERVICE: 'WCS', VERSION: '2.0.1', REQUEST: 'GetCoverage', COVERAGEID: LAYER,
    SUBSETTINGCRS: 'EPSG:4326', OUTPUTCRS: 'EPSG:4326', FORMAT: 'image/tiff'
  });
  extent.append('SUBSET', `long(${(point.lon - lonRadius).toFixed(5)},${(point.lon + lonRadius).toFixed(5)})`);
  extent.append('SUBSET', `lat(${(point.lat - latRadius).toFixed(5)},${(point.lat + latRadius).toFixed(5)})`);

  let nearestKm: number | null = null;
  let activeCells = 0;
  let priorGrid = '';
  for (const frame of frames) {
    const params = new URLSearchParams(extent);
    params.set('TIME', frame);
    const response = await fetch(`${SOURCE}?${params}`, { signal, cache: 'default' });
    if (!response.ok) throw new Error(`GeoMet coverage: HTTP ${response.status}`);
    if (!response.headers.get('Content-Type')?.toLowerCase().includes('image/tiff')) throw new Error('GeoMet returned a non-TIFF coverage response');
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength < 8 || new DataView(bytes).getUint16(0, true) !== 42) throw new Error('GeoMet returned data that is not a GeoTIFF');
    const image = await (await fromArrayBuffer(bytes)).getImage();
    const pixels = await image.readRasters({ interleave: true });
    const noData = Number(image.getGDALNoData());
    const [left, bottom, right, top] = image.getBoundingBox();
    const width = image.getWidth();
    const height = image.getHeight();
    if (image.getGeoKeys().GeographicTypeGeoKey !== 4326 || ![left, bottom, right, top].every(Number.isFinite) || width < 1 || height < 1 || pixels.length !== width * height) {
      throw new Error('GeoMet coverage lacks a valid geographic grid');
    }
    const grid = [left, bottom, right, top, width, height].join(',');
    if (priorGrid && grid !== priorGrid) throw new Error('GeoMet observation grids do not match');
    priorGrid = grid;
    for (let index = 0; index < pixels.length; index++) {
      const value = Number(pixels[index]);
      if (!Number.isFinite(value) || value <= 0 || value === noData) continue;
      const column = index % width;
      const row = Math.floor(index / width);
      if (row >= height) break;
      const cellLeft = left + column * (right - left) / width;
      const cellRight = left + (column + 1) * (right - left) / width;
      const cellTop = top - row * (top - bottom) / height;
      const cellBottom = top - (row + 1) * (top - bottom) / height;
      const cell = {
        lat: Math.max(cellBottom, Math.min(cellTop, point.lat)),
        lon: Math.max(cellLeft, Math.min(cellRight, point.lon))
      };
      const distance = distanceKm(point, cell);
      if (distance <= 60) {
        activeCells++;
        nearestKm = nearestKm === null ? distance : Math.min(nearestKm, distance);
      }
    }
  }
  return { latest, frames, nearestKm, activeCells, fresh: true };
}

export async function thunderForecast(point: Point, signal?: AbortSignal): Promise<boolean> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', point.lat.toFixed(4));
  url.searchParams.set('longitude', point.lon.toFixed(4));
  url.searchParams.set('hourly', 'weather_code');
  url.searchParams.set('forecast_days', '1');
  url.searchParams.set('timezone', 'UTC');
  const response = await fetch(url, { signal, cache: 'default' });
  if (!response.ok) throw new Error(`Open-Meteo forecast: HTTP ${response.status}`);
  const data = await response.json() as { hourly?: { time?: string[]; weather_code?: number[] } };
  const times = data.hourly?.time;
  const codes = data.hourly?.weather_code;
  if (!times || !codes || times.length !== codes.length) throw new Error('Open-Meteo forecast is incomplete');
  const now = Date.now();
  return times.some((time, index) => {
    const stamp = Date.parse(`${time}Z`);
    return stamp >= now - 3600000 && stamp <= now + 3 * 3600000 && [95, 96, 99].includes(codes[index]);
  });
}

export function overlayUrl(bounds: { getSouth(): number; getWest(): number; getNorth(): number; getEast(): number }, frame: string, width: number, height: number): string {
  const params = new URLSearchParams({
    SERVICE: 'WMS', VERSION: '1.3.0', REQUEST: 'GetMap', LAYERS: LAYER, STYLES: 'Lightning',
    CRS: 'EPSG:4326', BBOX: `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`,
    WIDTH: String(width), HEIGHT: String(height), FORMAT: 'image/png', TRANSPARENT: 'TRUE', TIME: frame
  });
  return `${SOURCE}?${params}`;
}

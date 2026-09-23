import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { overlayUrl, readLightning, thunderForecast, type LightningReading, type Point } from './lightning';
import { chooseSignal } from './signal';
import { formatBuildTimestamp } from './buildInfo';

type Language = 'en' | 'yue' | 'both';
const TORONTO: Point = { lat: 43.6532, lon: -79.3832 };
const THUNDER_KEY = 'storm-harbor-last-thunder';
const LANGUAGE_KEY = 'storm-harbor-language';
const words = {
  title: ['Storm Harbor Toronto', '多倫多風暴避風港'],
  eyebrow: ['A calmer way to watch the storm', '平靜啲睇住風暴'],
  map: ['Lightning map', '閃電地圖'],
  location: ['Selected location', '所選位置'],
  toronto: ['Reset to Toronto', '返回多倫多'],
  locate: ['Use my location', '使用我嘅位置'],
  refresh: ['Refresh now', '即刻更新'],
  thunder: ['I hear thunder', '我聽到雷聲'],
  thunderAgain: ['I hear thunder again', '我又聽到雷聲'],
  settings: ['Language', '語言'],
  lastObserved: ['Latest observation', '最近觀測'],
  near: ['Nearest observed lightning area', '最近觀測到嘅閃電區域'],
  none: ['None found within 60 km', '60 公里內未發現'],
  forecast: ['Thunderstorm forecast in the next 3 hours', '未來 3 小時雷暴預報'],
  yes: ['Yes', '有'],
  no: ['No', '冇'],
  unavailable: ['Unavailable', '暫時攞唔到資料'],
  sources: ['Sources and safety', '資料來源及安全提示'],
  red: ['Head to the basement now', '而家落地庫'],
  yellow: ['Get ready to move inside', '準備入室內'],
  green: ['No nearby lightning observed', '附近未觀測到閃電'],
  unknown: ['Live data unavailable', '即時資料暫時攞唔到'],
  redBody: ['Go to a safe, accessible basement if you have one. Otherwise stay in a fully enclosed building, away from windows, plumbing, and wired devices.', '如果地庫安全又去得到，就去地庫。否則留喺完整封閉嘅建築物，遠離窗、喉管同有線電器。'],
  yellowBody: ['Lightning is farther away or thunderstorms are forecast. Find your safe room and keep watching the sky.', '遠處有閃電，或者預報有雷暴。搵定安全嘅房間，繼續留意天氣。'],
  greenBody: ['This is an observation, not an all-clear. If you hear thunder, go indoors immediately.', '呢個只係觀測結果，唔係安全保證。如果聽到雷聲，即刻入室內。'],
  unknownBody: ['Do not treat missing data as safety. Listen for thunder and check official weather updates.', '冇資料唔代表安全。留意雷聲，同埋查閱官方天氣更新。'],
  thunderTimer: ['Remain inside until 30 minutes after the last thunder', '最後一聲雷之後，留喺室內至少 30 分鐘'],
  minuteShort: ['min', '分鐘'],
  buildVersion: ['Version', '版本'],
  buildUpdated: ['Updated', '更新於'],
  buildUnavailable: ['Build time unavailable', '編譯時間暫時無法確認'],
  choose: ['Tap the map to choose a location.', '撳地圖揀位置。'],
  mapNote: ['Colour shows observed lightning density, not exact strike points.', '顏色顯示觀測到嘅閃電密度，唔係準確落雷點。'],
  updated: ['Updated', '更新時間'],
  loading: ['Checking recent observations…', '查緊最近嘅觀測資料…'],
  redKicker: ['TAKE SHELTER', '立即避雷'],
  yellowKicker: ['PREPARE', '做好準備'],
  greenKicker: ['CURRENT OBSERVATION', '最新觀測'],
  unknownKicker: ['CHECK CONDITIONS', '留意天氣'],
  live: ['LIVE OBSERVATIONS', '即時觀測'],
  yourView: ['YOUR VIEW', '你揀嘅地方'],
  dataSays: ['WHAT THE DATA SAYS', '資料顯示'],
  about: ['ABOUT THIS MAP', '地圖說明'],
  latest: ['Latest', '最新'],
  minutesAgo: ['minutes ago', '分鐘前'],
  coordinateLat: ['Latitude', '緯度'],
  coordinateLon: ['Longitude', '經度'],
  useCoordinates: ['Set coordinates', '設定座標'],
  privacy: ['Choosing a location sends its coordinates to ECCC and Open-Meteo for weather data. This app does not keep location history.', '揀選位置會將座標傳送畀加拿大環境及氣候變化部同 Open-Meteo，以讀取天氣資料。本程式唔會儲存位置紀錄。'],
  invalidCoordinates: ['Enter valid latitude and longitude.', '請輸入有效嘅緯度同經度。'],
  locationSelected: ['Location selected.', '位置已選好。'],
  torontoSelected: ['Toronto selected.', '已選多倫多。'],
  locationUnavailable: ['Device location is unavailable. Use coordinates instead.', '裝置定位暫時用唔到，請改用座標。'],
  locationDenied: ['Location permission was not granted. Use coordinates instead.', '未取得定位權限，請改用座標。'],
  overlayUnavailable: ['The lightning image could not be displayed. The signal uses separately checked observation data.', '閃電圖層暫時顯示唔到；交通燈使用另外核實嘅觀測資料。'],
  sourcesIntro: ['Lightning density:', '閃電密度：'],
  forecastSource: ['Forecast:', '預報：'],
  mapSource: ['Map:', '地圖：'],
  safetyExplanation: ['Lightning can occur between updates. If you hear thunder, go indoors immediately and remain inside for 30 minutes after the last thunder. A basement is a comfort choice when accessible and safe, not a requirement for lightning protection.', '閃電可能喺更新之間發生。如果聽到雷聲，即刻入室內，最後一聲雷之後至少留喺室內 30 分鐘。地庫喺安全同去得到嘅情況下可以令你安心，但避雷唔一定要去地庫。'],
  officialGuidance: ['Read official lightning safety guidance ↗', '閱讀官方閃電安全指引 ↗'],
  dataError: ['Some live data could not be read.', '部分即時資料暫時讀唔到。'],
  observationError: ['Observations:', '觀測：'],
  forecastError: ['Forecast:', '預報：'],
  dismiss: ['Dismiss notification', '關閉通知']
} as const;

function copy(key: keyof typeof words, language: Language): string {
  const [english, cantonese] = words[key];
  return language === 'en' ? english : language === 'yue' ? cantonese : `${english} / ${cantonese}`;
}

function MapPanel({ point, setPoint, frames, chosenFrame, language, resetKey, onOverlayError }: {
  point: Point; setPoint: (point: Point) => void; frames: string[]; chosenFrame: number; language: Language;
  resetKey: number; onOverlayError: (message: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const overlay = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    if (!container.current || map.current) return;
    const instance = L.map(container.current, { zoomControl: false }).setView([TORONTO.lat, TORONTO.lon], 9);
    map.current = instance;
    L.control.zoom({ position: 'bottomright' }).addTo(instance);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 17
    }).addTo(instance);
    instance.on('click', event => setPoint({ lat: event.latlng.lat, lon: event.latlng.lng }));
    return () => { instance.remove(); map.current = null; };
  }, [setPoint]);

  useEffect(() => {
    if (!map.current) return;
    marker.current?.remove();
    marker.current = L.marker([point.lat, point.lon], {
      icon: L.divIcon({ className: 'location-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 12] }),
      title: copy('location', language),
      alt: copy('location', language),
      keyboard: false
    }).addTo(map.current);
    map.current.panTo([point.lat, point.lon]);
  }, [point, language]);

  useEffect(() => { if (resetKey > 0) map.current?.setView([TORONTO.lat, TORONTO.lon], 9); }, [resetKey]);

  useEffect(() => {
    const instance = map.current;
    const frame = frames[chosenFrame];
    if (!instance || !frame) return;
    const update = () => {
      overlay.current?.remove();
      const bounds = instance.getBounds();
      const size = instance.getSize();
      overlay.current = L.imageOverlay(overlayUrl(bounds, frame, Math.max(300, Math.round(size.x)), Math.max(300, Math.round(size.y))), bounds, {
        opacity: 0.76, interactive: false, alt: 'Recent lightning density overlay'
      }).on('error', () => onOverlayError('unavailable')).on('load', () => onOverlayError('')).addTo(instance);
    };
    update();
    instance.on('moveend', update);
    instance.on('resize', update);
    return () => { instance.off('moveend', update); instance.off('resize', update); overlay.current?.remove(); overlay.current = null; };
  }, [frames, chosenFrame, onOverlayError]);

  return <div className="map-shell" aria-label={copy('map', language)}><div ref={container} className="map-canvas" /></div>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem(LANGUAGE_KEY) as Language) || 'en');
  const [point, setPoint] = useState<Point>(TORONTO);
  const [reading, setReading] = useState<LightningReading | null>(null);
  const [forecast, setForecast] = useState<boolean | null>(null);
  const [readError, setReadError] = useState('');
  const [forecastError, setForecastError] = useState('');
  const [lastThunder, setLastThunder] = useState<number>(() => Number(localStorage.getItem(THUNDER_KEY) || 0));
  const [clock, setClock] = useState(Date.now());
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(true);
  const [chosenFrame, setChosenFrame] = useState(0);
  const [notice, setNotice] = useState<keyof typeof words | ''>('');
  const [overlayError, setOverlayError] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [latitudeInput, setLatitudeInput] = useState(String(TORONTO.lat));
  const [longitudeInput, setLongitudeInput] = useState(String(TORONTO.lon));
  const updatePoint = useMemo(() => (next: Point) => setPoint(next), []);

  useEffect(() => { localStorage.setItem(LANGUAGE_KEY, language); }, [language]);
  useEffect(() => { setLatitudeInput(point.lat.toFixed(4)); setLongitudeInput(point.lon.toFixed(4)); }, [point]);
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    const poll = window.setInterval(() => setReload(value => value + 1), 5 * 60000);
    return () => { window.clearInterval(timer); window.clearInterval(poll); };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setBusy(true);
    setReading(null);
    setForecast(null);
    setReadError('');
    setForecastError('');
    setChosenFrame(0);
    Promise.allSettled([
      readLightning(point, controller.signal).then(setReading).catch(error => { if (!controller.signal.aborted) setReadError(String(error)); }),
      thunderForecast(point, controller.signal).then(setForecast).catch(error => { if (!controller.signal.aborted) setForecastError(String(error)); })
    ]).then(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [point, reload]);

  const thunderActive = lastThunder > 0 && clock - lastThunder < 30 * 60000;
  const signal = chooseSignal(reading, forecast, thunderActive);
  const remaining = Math.max(0, Math.ceil((30 * 60000 - (clock - lastThunder)) / 60000));
  const timeFormat = (value: string) => new Date(value).toLocaleTimeString(language === 'yue' ? 'zh-HK' : 'en-CA', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

  const locate = () => {
    if (!navigator.geolocation) { setNotice('locationUnavailable'); return; }
    navigator.geolocation.getCurrentPosition(
      position => { setPoint({ lat: position.coords.latitude, lon: position.coords.longitude }); setNotice('locationSelected'); },
      () => setNotice('locationDenied'),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const submitCoordinates = (event: React.FormEvent) => {
    event.preventDefault();
    const lat = Number(latitudeInput);
    const lon = Number(longitudeInput);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setNotice('invalidCoordinates');
      return;
    }
    setPoint({ lat, lon });
    setNotice('locationSelected');
  };

  return <div className="app">
    <header className="topbar">
      <div className="brand"><div className="brand-mark" aria-hidden="true">✦</div><div><p className="eyebrow">{copy('eyebrow', language)}</p><h1>{copy('title', language)}</h1><p className="build-info"><span>{copy('buildVersion', language)} {__BUILD_INFO__.version}</span><span aria-hidden="true"> · </span><span>{copy('buildUpdated', language)} {formatBuildTimestamp(__BUILD_INFO__.builtAt, __BUILD_INFO__.timeZone, language === 'yue' ? 'zh-HK' : 'en-CA', copy('buildUnavailable', language))}</span></p></div></div>
      <label className="language-control">{copy('settings', language)}<select value={language} onChange={event => setLanguage(event.target.value as Language)}><option value="en">English</option><option value="yue">廣東話</option><option value="both">English + 廣東話</option></select></label>
    </header>
    <main>
      <section className={`signal-card signal-${signal}`} aria-live="polite">
        <div className="signal-lights" aria-label={copy(signal, language)}><i className={signal === 'red' ? 'active' : ''}/><i className={signal === 'yellow' ? 'active' : ''}/><i className={signal === 'green' ? 'active' : ''}/></div>
        <div className="signal-copy"><p className="signal-kicker">{copy(`${signal}Kicker` as keyof typeof words, language)}</p><h2>{copy(signal, language)}</h2><p>{copy(`${signal}Body` as keyof typeof words, language)}</p>
          {thunderActive && <p className="thunder-note">{copy('thunderTimer', language)} · {remaining} {copy('minuteShort', language)}</p>}
        </div>
        <button className="thunder-button" onClick={() => { const now = Date.now(); setLastThunder(now); localStorage.setItem(THUNDER_KEY, String(now)); setClock(now); }}>
          {copy(thunderActive ? 'thunderAgain' : 'thunder', language)}
        </button>
      </section>
      <div className="content-grid">
        <section className="map-card"><div className="section-heading"><div><p className="eyebrow">{copy('live', language)}</p><h2>{copy('map', language)}</h2></div><span className="section-hint">{copy('choose', language)}</span></div>
          <MapPanel point={point} setPoint={updatePoint} frames={reading?.frames || []} chosenFrame={chosenFrame} language={language} resetKey={resetKey} onOverlayError={setOverlayError} />
          <div className="map-footer"><div className="frame-controls" aria-label={copy('lastObserved', language)}>{reading?.frames.map((frame, index) => <button key={frame} className={chosenFrame === index ? 'selected' : ''} onClick={() => setChosenFrame(index)}>{index === 0 ? copy('latest', language) : `${index * 10} ${copy('minutesAgo', language)}`}</button>)}</div><p>{copy('mapNote', language)}</p>{overlayError && <p role="status">{copy('overlayUnavailable', language)}</p>}</div>
        </section>
        <aside className="sidebar"><section className="detail-card"><p className="eyebrow">{copy('yourView', language)}</p><h2>{copy('location', language)}</h2><p className="coordinates">{point.lat.toFixed(4)}°, {point.lon.toFixed(4)}°</p><p className="privacy-note">{copy('privacy', language)}</p><div className="button-row"><button onClick={locate}>{copy('locate', language)}</button><button onClick={() => { setPoint(TORONTO); setResetKey(value => value + 1); setNotice('torontoSelected'); }}>{copy('toronto', language)}</button></div><form className="coordinate-form" onSubmit={submitCoordinates}><label>{copy('coordinateLat', language)}<input type="number" min="-90" max="90" step="any" value={latitudeInput} onChange={event => setLatitudeInput(event.target.value)} /></label><label>{copy('coordinateLon', language)}<input type="number" min="-180" max="180" step="any" value={longitudeInput} onChange={event => setLongitudeInput(event.target.value)} /></label><button type="submit">{copy('useCoordinates', language)}</button></form></section>
          <section className="detail-card"><p className="eyebrow">{copy('dataSays', language)}</p><dl><div><dt>{copy('lastObserved', language)}</dt><dd>{reading?.latest ? timeFormat(reading.latest) : copy('unavailable', language)}</dd></div><div><dt>{copy('near', language)}</dt><dd>{reading?.nearestKm != null ? `~${Math.round(reading.nearestKm)} km` : reading?.fresh ? copy('none', language) : copy('unavailable', language)}</dd></div><div><dt>{copy('forecast', language)}</dt><dd>{forecast === null ? copy('unavailable', language) : copy(forecast ? 'yes' : 'no', language)}</dd></div></dl><button className="refresh-button" disabled={busy} onClick={() => setReload(value => value + 1)}>{busy ? copy('loading', language) : copy('refresh', language)}</button></section>
          <section className="detail-card source-card"><p className="eyebrow">{copy('about', language)}</p><h2>{copy('sources', language)}</h2><p>{copy('sourcesIntro', language)} <a href="https://eccc-msc.github.io/open-data/msc-data/lightning/readme_lightning_en/" target="_blank" rel="noreferrer">Environment and Climate Change Canada</a>. {copy('forecastSource', language)} <a href="https://open-meteo.com/en/docs" target="_blank" rel="noreferrer">Open-Meteo</a>. {copy('mapSource', language)} OpenStreetMap contributors.</p><p>{copy('safetyExplanation', language)}</p><a href="https://www.canada.ca/en/environment-climate-change/services/lightning/safety/preparedness-fact-sheet.html" target="_blank" rel="noreferrer">{copy('officialGuidance', language)}</a></section>
        </aside>
      </div>
      {(readError || forecastError) && <p className="data-error" role="status">{copy('dataError', language)} {readError && `${copy('observationError', language)} ${readError}.`} {forecastError && `${copy('forecastError', language)} ${forecastError}.`}</p>}
      {notice && <div className="notice" role="status">{copy(notice, language)}<button onClick={() => setNotice('')} aria-label={copy('dismiss', language)}>×</button></div>}
    </main>
  </div>;

}

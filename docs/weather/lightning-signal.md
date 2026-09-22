# Lightning signal

The app reads the latest three ten-minute `Lightning_2.5km_Density` frames from Environment and Climate Change Canada's GeoMet service. It checks the layer capabilities for current times, reads a compact georeferenced GeoTIFF around the selected location for each time, and finds the nearest positive-density cell footprint. It separately asks Open-Meteo for hourly thunderstorm weather codes over the next three hours.

The signal is red for observed lightning within 30 km or a user report of thunder, yellow for observed activity from 30 to 60 km or forecast thunderstorms, and green only when all recent observations and forecast data are valid and clear by those rules. Missing frames, malformed TIFF data, invalid geographic grids, an observation older than 20 minutes, or failed forecast data lead to an unavailable state unless a report of thunder has already set red.

The red wording puts a safe, accessible basement first as the selected comfort choice. Any fully enclosed building provides lightning shelter; a basement is not required. The app never treats the absence of a detected flash as a safety guarantee. If thunder is heard, go indoors immediately and stay for 30 minutes after the last thunder.

Selected coordinates are sent to ECCC and Open-Meteo only to request weather data. Device location is requested only after the user selects it, and no location history is stored by the app. The map uses OpenStreetMap tiles with visible attribution. Browser caching follows provider headers; there is no background tile download. At substantial public scale, a shared weather-data cache should replace per-visitor GeoMet requests to remain within the provider's usage guidance.

Verification: `npm test` covers TIFF header recognition, XML service errors, UTC forecast rollover, and signal thresholds. A live one-shot GeoMet request returned a valid Toronto GeoTIFF. Browser interaction and visual inspection remain pending on the required isolated UI route.

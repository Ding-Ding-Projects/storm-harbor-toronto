# Design reference

The product uses a low-stimulation weather dashboard: one prominent shelter card, a large map, and a compact source panel. Red, yellow, green, and unavailable states always include text. The original shield-and-lightning mark is in `storm-harbor.svg`; `scripts/build-icons.mjs` generates the packaged icons from it.

Reference states: recent lightning within 30 km, lightning from 30 to 60 km, no nearby observed lightning, stale or unavailable data, and user-reported thunder. The default desktop viewport is 1360 × 900; the minimum supported width is 320 px. Light and dark themes follow system preference. Reduced-motion preference suppresses animation.

Material Designer creation and export were not available as a callable tool in this task environment, so the checked-in vector source and this state inventory are the implementation reference. Runtime captures and layout measurements are still required before visual verification is claimed.

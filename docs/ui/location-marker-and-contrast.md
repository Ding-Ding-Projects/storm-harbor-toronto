# Location pin and dark-theme build label

The selected-location pin marks the map point visually. The adjacent detail card provides the selected coordinates and weather data as text. The pin is noninteractive, has no keyboard stop, and is hidden from assistive technology after Leaflet creates its icon element. The map and coordinate controls remain usable to choose a location. `tests/interface-accessibility.test.mjs` checks the marker options and the accessibility attributes; built-interface inspection is still required.

The small version and build-time label uses a lighter foreground in dark mode. The same test calculates contrast against the declared dark background and requires at least 4.5:1 for normal text. The declared colors calculate to 10.18:1. A real rendered dark-theme capture remains pending.

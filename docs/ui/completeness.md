# Per-surface completeness inventory

The public website and the Windows and Android packages currently share the React interface under `src/`. This inventory is deliberately fail-closed: a row is complete only when its implementation, localized copy, persistence where relevant, documentation, focused tests, built-interface interaction, and genuine capture are all present. `0.1.0` captures cover the main map and signal only. The `0.1.1` version label is implemented in source, but its built-interface proof is still pending.

| ID | Required capability | Current source and documentation | Localization and persistence | Focused tests | Built interaction and capture | State |
| --- | --- | --- | --- | --- | --- | --- |
| UI-001 | English, Cantonese, and bilingual display | `src/App.tsx`; weather guides in `docs/weather/` | Three modes exist; language choice persists locally | No focused language suite | `0.1.0` language switch observed; no complete state matrix | Partial |
| UI-002 | Independent funny-level controls for both languages | None | Missing | Missing | Missing | Missing |
| UI-003 | Dialog and message emoji preference | None; there is no settings surface | Missing | Missing | Missing | Missing |
| UI-004 | Local vocabulary JSON upload, replace, clear, bounds, and safe cache | None | Missing | Missing | Missing | Missing |
| UI-005 | Shared, renameable School mode and resettable unlock credential | None | Missing; web, desktop, and Android storage is not shared | Missing | Missing | Missing |
| UI-006 | Accessible narration controls and language selection | None | Missing | Missing | Missing | Missing |
| UI-007 | Scheduled language, appearance, and external settings sources | None | Missing | Missing | Missing | Missing |
| UI-008 | Optional food-themed surprise with complete settings | None | Missing | Missing | Missing | Missing |
| UI-009 | Searchable settings, adjacent full regex builder, and element customization | There is no settings surface or settings search | Missing | Missing | Missing | Missing |
| UI-010 | ADHD-oriented focus and reduced-distraction modes | Reduced-motion CSS only in `src/styles.css`; no focus-mode control | Missing | Missing | Missing | Partial |
| UI-011 | Non-blocking notifications with localized, persistent state | `src/App.tsx` uses a status region for notices and data errors | Language is localized; notification preferences are absent | Signal/data tests do not cover notification behavior | `0.1.0` thunder action was captured; notification states are incomplete | Partial |
| UI-012 | Strong confirmation for destructive actions | No destructive settings or confirmation pattern | Missing | Missing | Missing | Missing |
| UI-013 | Registered design components and user appearance customization | `src/styles.css` uses custom interface styling and system dark mode | System theme only; no appearance editor | Missing design-system checks | No component-registration or full appearance evidence | Missing |
| UI-014 | App-logo customization and safe conversion | `assets/`, `design/storm-harbor.svg`, and `scripts/build-icons.mjs` provide a fixed original icon | User customization and conversion controls are absent | Icon-build checks only | Package icons were inspected for `0.1.0`; customization is unproven | Partial |
| UI-015 | General file conversion | No general converter; coordinate inputs are numeric fields in `src/App.tsx` | Not applicable to current inputs, but no closest accessible conversion flow exists | Missing | Missing | Missing |
| UI-016 | Local Ollama suite manager | The product makes direct public weather requests and has no model runner | No runner settings or local-model inventory | Missing | Missing | Missing |
| UI-017 | Tabbed navigation, groups, and tab search | Map and weather details are shown in one page layout | No tab state or persistence | Missing | Existing map/sidebar captured at desktop size only | Missing |
| UI-018 | Locked tabs, locked appearance, and support tickets | No locks, authentication, or ticket surface | Missing | Missing | Missing | Missing |
| UI-019 | A play-based unlock and recovery ladder | No lockout-capable settings exist | Missing | Missing | Missing | Missing |
| UI-020 | Two-factor registration and built-in authenticator | The weather map has no accounts or sign-in | No credential state | Missing | Missing | Missing |
| UI-021 | Secret and display-name mutation history | No secret or display-name editing surfaces | Missing | Missing | Missing | Missing |
| UI-022 | Documentation browser, articles, and site-level settings | Weather and distribution articles live under `docs/` | Articles are English; an in-app browser and site controls are absent | Missing article-to-interface inventory | No documentation interface capture | Missing |
| UI-023 | Vendored typefaces with a reproducible source | The interface uses system fonts in `src/styles.css` | System fallback is available in every language | Missing | No typeface provenance evidence | Partial |
| UI-024 | README with real captures and tabbed sections | `README.md` describes the product and current verification | One continuous Markdown document; it does not have tabbed sections | Missing | Baseline captures exist in `evidence/`, but no validated receipt inventory is checked in | Partial |
| UI-025 | Screen recording retained with source | No recording is present | Not applicable to stored preferences | Missing | Missing | Missing |
| UI-026 | Release line-count report from automation | `docs/distribution/downloads.md` documents downloads | No automated source line-count report | Missing | No automated report | Missing |
| UI-027 | Public share-preview image on the repository and website | No checked-in share-preview image or metadata is registered | Not applicable | Missing | Missing | Missing |
| UI-028 | Sanitized repository instructions | `AGENTS.md` contains project safety and writing boundaries in ordinary language | No product setting | Manual scan required | Source scan is pending for this candidate | Partial |
| UI-029 | External editor integration | No editor or editable document is provided | Missing | Missing | Missing | Missing |
| UI-030 | Export of user-visible data in common formats | No export action is present | Missing | Missing | Missing | Missing |
| UI-031 | Bulk actions over owned data | The app holds one current map point and three recent frames | No bulk selection or action model | Missing | Missing | Missing |
| UI-032 | Local version history for user edits | No user-authored records are edited | Missing | Missing | Missing | Missing |
| UI-033 | Presets for empty editors | No editor surface exists | Missing | Missing | Missing | Missing |
| UI-034 | Changelog browser | Release notes live in GitHub Releases; no in-app browser exists | Missing | Missing | Missing | Missing |
| UI-035 | Searchable command palette | No command palette exists | Missing | Missing | Missing | Missing |
| UI-036 | Each visual overlay paints its own surface | Map overlay errors are reported separately from the numeric signal in `src/App.tsx` | Message follows current language | Existing overlay behavior lacks a focused test | The overlay states have not been captured | Partial |
| UI-037 | Context menus with keyboard shortcuts | No custom context menu exists; the map keeps its native map interactions | Missing | Missing | Missing | Missing |
| UI-038 | Progress and cancellation for long operations | `src/App.tsx` shows loading state for refreshes | Loading copy is localized; cancellation and progress detail are absent | Data tests do not cover progress states | One loading state captured at baseline only | Partial |
| UI-039 | Browser-extension download tracking dialogs | No browser extension is shipped | No extension settings | Missing | Missing | Missing |
| UI-040 | Recovery instructions for failed operations | Data errors use a status message; the signal becomes unavailable when readings are invalid | Most primary states are localized | Weather and signal tests cover several source failures | Error recovery states are not captured | Partial |
| UI-041 | Safe rendering of provider-authored text | Provider errors are rendered in a status region; response handling lives in `src/lightning.ts` | Primary user copy is localized | Malformed response tests exist; output-escaping review is missing | Built failure-state capture is missing | Partial |
| UI-042 | Publishing controls for user-authored content | No user-authored content is published from the app | Missing | Missing | Missing | Missing |
| UI-043 | Collapsible filters and statistics with plain and regex search | No collection filter or statistics panel exists | Missing | Missing | Missing | Missing |
| UI-044 | Visible version and updated-at time on the front screen | `vite.config.ts` generates provenance; `src/App.tsx` renders it; `docs/distribution/build-provenance.md` explains the web and desktop metadata | English, Cantonese, and bilingual labels are provided | `tests/build-info.test.mjs` covers valid UTC, invalid time, missing time zone, and invalid time zone | `0.1.1` build succeeds with dirty source; clean build and fresh web, desktop, and Android captures pending | Partial |
| UI-045 | Full per-surface completeness and red-then-green negative regression | This file is the current manual inventory | Persistence and locale links are listed per row where known | Negative regression is missing | Most feature rows have no interaction evidence | Missing |
| UI-046 | Checked-in design-reference parity matrix | `design/README.md` describes the current visual direction and design-tool limitation | Language, theme, viewport, and scale matrix is incomplete | Missing | No parity receipts, comparisons, or matching captures | Missing |

## Release blockers

The table contains incomplete user-interface work beyond the original storm-map flow. The map and traffic signal are functional, but this project does not satisfy the complete settings and surface contract. The Windows and Android installed-interface checks are also open in [issue #1](https://github.com/Ding-Ding-Projects/storm-harbor-toronto/issues/1). Do not describe the interface contract as complete until every row has its implementation and required evidence or a documented supported equivalent.

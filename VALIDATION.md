# Validation notes — 2026-09-09

- Local page compiled and returned HTTP 200. Browser preview opened at the development server URL. Broad browser UI QA was not requested and was not performed.
- TypeScript checked with `npx tsc --noEmit`.
- `node scripts/check-data.mjs`: 17 valid segments, 4 endpoint/overnight combinations, BD09 navigation URL encoding, WGS84 coordinate bounds, playback start/end interpolation, and exclusion of the erroneous hot-spring origin.
- Required Arxan photo returned HTTP 200 image/jpeg. OSM connectivity checked with the documented application-identifying User-Agent and actual local Referer; returned genuine cacheable image/png. Generic curl requests are not an appropriate OSM availability test.
- Generated leaf was inspected; genuine transparent RGBA PNG. Leaf motion is triggered only by clicks/scrolling (1.8–2.1 seconds), never autoplay or looping; capped and throttled particles are removed after finishing. Can be disabled, respects reduced motion, and does not intercept pointers. Photo is historical; leaf is decorative generated imagery.
- `configure_trip_preview` WebMCP registration is feature-detected and has input validation/AbortSignal cleanup. No supported live WebMCP validation context was available; its browser contract was not verified and is not required by the user.
- The supplied starter's package audit reports server/development dependencies with advisories. The delivered artifact is a static export only (`dist/client`); it exposes no server functions, image parser service, upload endpoint or development server. Dependencies are not silently force-upgraded. Reassess and patch before adding a public application server.
- Known scope limits: actual rental branches and hotels pending, navigation opens per leg (Baidu Web URI has no documented waypoint field), timing is a 2026-09-09 baseline and not holiday traffic prediction. Basemap availability depends on network/service access.

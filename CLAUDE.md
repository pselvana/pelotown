# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (SvelteKit on :3000 + WS on :3001)
npm run build      # Build for production
npm start          # Start production server (node --import tsx/esm server.ts)
node test-ws.js    # Send random cadence/resistance metrics via WebSocket
```

Server runs at `http://localhost:3000`. WebSocket at `ws://localhost:3000` (prod) or `ws://localhost:3001` (dev).

**Docker:**
```bash
docker build -t pelotown .
docker run -d --name Pelotown -p 3000:3000 -v <local-video-folder>:/app/videos pelotown
```

## Architecture

PelotOWN is a fitness video browsing/playback app. Stack: **SvelteKit 2 + Svelte 5**, **Tailwind CSS + DaisyUI**, **SQLite** (`better-sqlite3`).

**Custom server** ([server.ts](server.ts)): In production, a raw `http.Server` hosts both SvelteKit's `handler` (adapter-node) and a `ws.WebSocketServer` on the same port. In dev, the WS server runs standalone on port 3001 (`ws-dev-server.ts`).

**Backend hooks** ([src/hooks.server.ts](src/hooks.server.ts)):
- Initializes SQLite schema on startup
- Runs one-time migration of legacy `/stats/*.txt` play records
- Triggers initial video scan, then rescans every **15 minutes**
- Singleton guard (`global._appInitialized`) survives Vite HMR

**Server lib** ([src/lib/server/](src/lib/server/)):
- `db.ts` — `better-sqlite3` singleton, schema bootstrap
- `scanner.ts` — recursive `.mp4` walk + DB upsert; also `scanDirectory()` for live browse
- `videos.ts` — `getLatestVideos()`, `getPopularVideos()`, `recordPlay()`
- `migrate.ts` — one-time import of `/stats/*.txt` into `plays` table

**Database** (`$VIDEOS_PATH/pelotown.db` — lives inside the Docker volume):
- `videos` — one row per unique `.mp4` file (upserted on each scan)
- `plays` — every play event with timestamp (never deleted)
- `migrations` — tracks one-time migrations

**Frontend** ([src/routes/](src/routes/), [src/components/](src/components/)): SvelteKit pages with Svelte 5 runes.
- `+page.server.ts` — `load()` dispatches to browse/latest/popular based on `?view=`
- `+page.svelte` — gallery, filter bar, breadcrumb, player overlay
- Components: `VideoCard`, `FilterBar`, `ContentGrid`, `FolderCard`, `PlayerView`, `LiveMetricsBar`, `MetricTile`, `Breadcrumb`
- `$lib/stores/metrics.ts` — WebSocket Svelte store + `connectMetrics()`
- `$lib/instructors.ts` — 55+ instructor name→thumbnail URL map

**API endpoints:**
- `GET /api/browse/[[path]]` — list folders and videos (real-time filesystem)
- `GET /api/latest` — 25 most recently played (deduplicated, from DB)
- `GET /api/popular` — 25 most frequently played (from DB)
- `GET /videos/[...path]` — stream MP4 with range request support + records play
- `WS /` — broadcast `{cadence, resistance}` to all connected clients

**Real-time metrics:** External client sends `{cadence, resistance}` over WebSocket. Frontend derives Speed (`resistance * 30 * 3.6` km/h) and Power (`resistance * cadence² / 30` watts).

**Filename format:** `exercise_YYYYMMDD_duration_instructor_type_music_title.mp4`

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `VIDEOS_PATH` | `./videos` | Absolute path to video files + DB |
| `STATS_PATH` | `./stats` | Legacy stats dir (one-time migration) |
| `PUBLIC_WS_URL` | auto | WebSocket URL for browser (dev: `ws://localhost:3001`) |

## Design System

DaisyUI theme `pelotown` defined in [tailwind.config.ts](tailwind.config.ts):
- Primary: Electric Blue `#97a9ff`, Secondary: Coral `#ff716c`, Background: Midnight `#0b0e14`
- Font: Lexend (geometric, distance-readable)
- Glassmorphism overlays: `backdrop-blur-2xl bg-base-300/60 border border-base-content/10`
- No hard borders — use tonal `bg-base-200`/`bg-base-300` surface shifts

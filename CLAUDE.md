# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm start          # Start production server (node server.js)
npm run dev        # Start dev server with auto-reload (nodemon)
node test-ws.js    # Send random cadence/resistance metrics via WebSocket (for testing)
```

Server runs at `http://localhost:3000`. WebSocket endpoint at `ws://localhost:3000`.

**Docker:**
```bash
docker build -t pelotown .
docker run -d --name Pelotown -p 3000:3000 -v <local-video-folder>:/app/videos pelotown
```

## Architecture

PelotOWN is a fitness video browsing/playback app. The stack is intentionally minimal: no build tools, no TypeScript, no frontend framework.

**Backend** ([server.js](server.js)): Express + WebSocket (`ws`) on a single HTTP server.
- Scans the `/videos` folder recursively for `.mp4` files
- Parses filenames into metadata: `exercise_YYYYMMDD_duration_instructor_type_music_title.mp4`
- Tracks play history in `/stats/{unix_timestamp}.txt` (filesystem as persistence — no database)
- Streams video with HTTP range requests
- Broadcasts WebSocket messages `{cadence, resistance}` to all connected clients

**Frontend** ([public/](public/)): Single HTML page with vanilla JS and CSS.
- [public/app.js](public/app.js): Gallery browsing, filtering, video player controls, WebSocket client. Hardcodes ~60 Peloton instructor names and image URLs.
- [public/styles.css](public/styles.css): Design system via CSS custom properties. No 1px borders — uses tonal surface shifts for depth. Glassmorphism overlays.
- [public/index.html](public/index.html): App shell. Views toggled by `?view=` query param (`all`, `latest`, `popular`).

**API endpoints:**
- `GET /api/browse[/{path}]` — list folders and videos
- `GET /api/getLatestVideos` — 25 most recently played (deduplicated)
- `GET /api/getPopularVideos` — 25 most frequently played
- `GET /videos/{path}` — stream MP4

**Real-time metrics:** External client (e.g. bike sensor) sends `{cadence, resistance}` over WebSocket. Frontend derives Speed (`cadence * 0.233` km/h) and Power (`resistance * cadence * 2` watts).

## Design System

Defined in [DESIGN.md](DESIGN.md). Key constraints:
- **No hard borders** — use tonal background shifts and negative space instead
- Primary: Electric Blue `#97a9ff`, Secondary: Coral `#ff716c`, Background: Midnight `#0b0e14`
- Font: Lexend (geometric, distance-readable)
- Hover: `scale(1.02)` transforms, not color changes
- Overlays: glassmorphism (24px blur, 60% opacity)
- All tokens are CSS custom properties in [public/styles.css](public/styles.css)

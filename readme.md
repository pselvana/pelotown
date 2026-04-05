# PelotOWN

A bicycle-themed video player application that allows you to browse and play your workout videos with real-time metrics overlay.

Requires (FUTURE) integration with: https://github.com/pselvana/peloton-overlay

## Features

- Browse MP4 videos from your videos folder with a thumbnail gallery view
- Support for nested folders and directory navigation
- Breadcrumb navigation for easy folder traversal
- Full-screen video playback with intuitive controls
- Real-time metrics display with Cadence and Resistance values via WebSocket (requires compatible client)
- Responsive design with bicycle-themed UI
- Easy navigation with keyboard shortcuts and on-screen controls

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone or download this repository
2. Install dependencies

```bash
npm install
```

3. Create a "videos" folder in the root directory and add your MP4 workout videos

```bash
mkdir videos
```

4. Start the server

```bash
node server.js
```

5. Open your browser and navigate to `http://localhost:3000`

### Docker

1. Build image
```bash
docker build -t pelotown .
```

2. Run image with videos folder mounted
```bash
docker run -d --name Pelotown -p 3000:3000 -v <local folder of videos>:/app/videos pelotown
```




## Usage

### Video Gallery

- Click on folders to navigate inside
- Use the breadcrumb navigation to jump to parent folders
- Double-click on any video thumbnail to start playback
- Videos are loaded from the "videos" folder in your application directory

### Directory Structure

You can organize your videos in a folder structure like this:

```
videos/
├── beginner/
│   ├── workout1.mp4
│   └── workout2.mp4
├── intermediate/
│   ├── hiit/
│   │   └── interval1.mp4
│   └── endurance/
│       └── long_ride.mp4
└── advanced/
    └── race_simulation.mp4
```

### Video Player

- Click the X button or press ESC to close the video and return to the gallery
- Real-time metrics are displayed on both sides of the video
- Full playback controls are available (play/pause, seek, volume)

### WebSocket Client

To send metrics to the application, connect to the WebSocket server at `ws://localhost:3000` and send JSON messages in this format:

```json
{
  "cadence": 85,
  "resistance": 45
}
```
See `test-ws.js` for example code.

You can send either or both values as needed. The display will update in real-time for all connected clients.

## Directory Structure

```
/
├── server.js         # Main server file
├── videos/           # Place your MP4 files and folders here
└── public/
    ├── index.html    # Main HTML file
    ├── styles.css    # CSS styles
    └── app.js        # Client-side JavaScript
```

## License

MIT

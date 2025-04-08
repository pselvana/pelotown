// server.js - Main application file with subfolder support
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const app = express();
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });
const clients = new Set();

// Store current metrics
let currentMetrics = {
  cadence: 0,
  resistance: 0
};

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  // Send current metrics to newly connected client
  ws.send(JSON.stringify(currentMetrics));
  
  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Update metrics if valid data received
      if ('cadence' in data || 'resistance' in data) {
        if ('cadence' in data) currentMetrics.cadence = data.cadence;
        if ('resistance' in data) currentMetrics.resistance = data.resistance;
        
        // Broadcast updated metrics to all clients
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(currentMetrics));
          }
        });
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Serve static files
app.use(express.static('public'));

// Function to scan directory for videos and subfolders
function scanDirectory(dirPath, relativePath = '') {
  const result = {
    folders: [],
    videos: []
  };
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return result;
  }
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    // ignore if hidden
    if (item.startsWith('.')) continue;

    if (stats.isDirectory()) {
      result.folders.push({
        name: item,
        path: path.join(relativePath, item)
      });
    } else if (stats.isFile() && path.extname(item).toLowerCase() === '.mp4') {
      // Extract name parameters from item name: Peloton_20240429_10_Kendall Toole_Dance_10 min Cool Down Ride.mp4 => provider=Peloton, date=20240429, duration=10, instructor=Kendall Toole, type=Dance, title=10 min Cool Down Ride
      const nameParts = item.split('_');
      const exercise = nameParts[0];
      const date = nameParts[1];
      const duration = nameParts[2];
      const instructor = nameParts[3];
      const theme = nameParts[4];
      const music = nameParts[5];
      const title = nameParts.slice(6).join('_').replace('.mp4', '');

      // push video details to result including exercise, date, duration, instructor, theme, music, title
      result.videos.push({
        name: item,
        path: path.join(relativePath, item),
        size: stats.size,
        modified: stats.mtime,
        exercise: exercise,
        date: date,
        duration: duration,
        instructor: instructor,
        theme: theme,
        music: music,
        title: title
      });
    }
  }
  
  return result;
}

// API endpoint to list videos and folders
app.get('/api/browse/*', (req, res) => {
  let relativePath = req.params[0] || '';
  // Sanitize path to prevent directory traversal
  relativePath = relativePath.replace(/\.\./g, '');
  
  const dirPath = path.join(__dirname, 'videos', relativePath);
  
  try {
    const result = scanDirectory(dirPath, relativePath);
    res.json(result);
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

// API endpoint for root videos folder
app.get('/api/browse', (req, res) => {
  const dirPath = path.join(__dirname, 'videos');
  
  try {
    const result = scanDirectory(dirPath);
    res.json(result);
  } catch (err) {
    console.error('Error reading videos directory:', err);
    res.status(500).json({ error: 'Failed to read videos directory' });
  }
});

// Serve video files
app.get('/videos/*', (req, res) => {
  const relativePath = req.params[0];
  // Sanitize path to prevent directory traversal
  const sanitizedPath = relativePath.replace(/\.\./g, '');
  const videoPath = path.join(__dirname, 'videos', sanitizedPath);
  
  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }
  
  // Stream the video
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    });
    
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    });
    
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Serve the main page for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`PelotOWN server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('✓ Connected');

  const send = () => {
    const payload = {
      cadence: Math.floor(Math.random() * 60) + 60,      // 60–120
      resistance: Math.floor(Math.random() * 50) + 10,   // 10–60
    };
    console.log('→ Sending:', payload);
    ws.send(JSON.stringify(payload));
  };

  send();
  setInterval(send, 3000);
});

ws.on('message', (data) => {
  console.log('← Received:', JSON.parse(data));
});

ws.on('close', () => {
  console.log('✗ Disconnected');
});

ws.on('error', (err) => {
  console.error('✗ Error:', err.message);
});

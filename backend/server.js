const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors'); // Import CORS


const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersecret';
const DATA_FILE = 'data.json';

let currentMargin = 30; // Default ±30%
let previousNumber = Math.random() * 100;

// Load historical data
let historicalData = [];
if (fs.existsSync(DATA_FILE)) {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  historicalData = data.slice(-15);
}

// Enable CORS
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from frontend origin
app.use(bodyParser.json());

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

// Broadcast message to all connected clients
const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Generate random number within ±margin
const generateRandomNumber = () => {
  let min = Math.max(0, previousNumber * (1 - currentMargin / 100));
  let max = Math.min(100, previousNumber * (1 + currentMargin / 100));

  // Prevent shrinking numbers
  if (previousNumber < 1) {
    min = 20;
    max = 80;
  }

  const randomNumber = Math.random() * (max - min) + min;
  previousNumber = randomNumber;

  const timestamp = new Date().toISOString();
  const dataPoint = { number: randomNumber, timestamp };

  // Save to historical data
  historicalData.push(dataPoint);
  if (historicalData.length > 15) {
    historicalData.shift();
  }

  // Persist to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(historicalData, null, 2));

  // Broadcast new data
  broadcast({ type: 'newNumber', data: dataPoint });
};

setInterval(generateRandomNumber, 10000);

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Send historical data on connection
  ws.send(JSON.stringify({ type: 'historicalData', data: historicalData }));

  // Send current margin
  ws.send(JSON.stringify({ type: 'margin', value: currentMargin }));
});

// Handle margin update
app.post('/margin', (req, res) => {
  const { margin } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    jwt.verify(token, SECRET_KEY);
    if (typeof margin === 'number' && margin >= 0 && margin <= 100) {
      currentMargin = margin;
      broadcast({ type: 'margin', value: currentMargin });
      return res.status(200).json({ success: true });
    }
    res.status(400).json({ success: false, message: 'Invalid margin value' });
  } catch {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

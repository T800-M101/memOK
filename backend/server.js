import express from 'express';
import cors from 'cors';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// ====================
// Paths
// ====================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'collections.json');

// Create data folder if missing
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create empty collections file if missing
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// ====================
// Middleware
// ====================

app.use(cors());

app.use(express.json());

// ====================
// Health
// ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ====================
// Root
// ====================

app.get('/', (req, res) => {
  res.json({
    name: 'memOK Proxy Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      collections: 'GET /api/collections',
      saveCollections: 'POST /api/collections',
      proxy: 'POST /proxy?url={target_url}',
      parseCurl: 'POST /parse-curl',
    },
  });
});

// ====================
// Collections
// ====================

app.get('/api/collections', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');

    if (!data.trim()) {
      return res.json([]);
    }

    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading collections:', err);

    res.status(500).json({
      error: 'Failed to load collections',
    });
  }
});

app.post('/api/collections', (req, res) => {
  try {
    const collections = req.body;

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(collections, null, 2),
    );

    console.log(
      `Saved ${collections.length ?? 0} collections`,
    );

    res.status(200).json({
      message: 'Saved successfully',
    });
  } catch (err) {
    console.error('Error saving collections:', err);

    res.status(500).json({
      error: 'Failed to save collections',
    });
  }
});

// ====================
// Proxy Request
// ====================

app.post('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  const start = Date.now();

  if (!targetUrl) {
    return res.status(400).json({
      error: 'Missing URL parameter',
    });
  }

  console.log(
    `[${new Date().toISOString()}] ${
      req.body.method || 'GET'
    } ${targetUrl}`,
  );

  try {
    const response = await axios({
      method: req.body.method || 'GET',
      url: targetUrl,
      headers: req.body.headers || {},
      data: req.body.body || null,
      timeout: 30000,
      validateStatus: () => true,
    });

    const duration = Date.now() - start;

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      duration: `${duration}ms`,
      body: response.data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Proxy error:', err.message);

    res.status(500).json({
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ====================
// Parse cURL
// ====================

app.post('/parse-curl', async (req, res) => {
  const { curl } = req.body;

  if (!curl) {
    return res.status(400).json({ error: 'Missing curl field in body' });
  }

  try {
    const { toJsonObject } = await import('curlconverter');

    const cleanCurl = curl.replace(/\\\n/g, ' ').replace(/\s+/g, ' ');

    const rawParsed = toJsonObject(cleanCurl);

    const formattedResponse = transformToFrontendFormat(rawParsed);

    res.json(formattedResponse);
  } catch (err) {
    res.status(400).json({ error: `Invalid cURL command: ${err.message}` });
  }
});

// ====================
// Start Server
// ====================

app.listen(PORT, () => {
  console.log('\n🚀 Memoman Proxy Server');
  console.log(
    `📍 Server running at http://localhost:${PORT}`,
  );
  console.log(
    `📡 Health check: http://localhost:${PORT}/health`,
  );
  console.log('\n✅ Server is ready!\n');
});

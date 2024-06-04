import express from 'express';
import base62 from 'base62/lib/ascii.js';

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for URL mappings
const urlMap = new Map();
let nextId = 1;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to create shortened URLs
app.post('/urls', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Generate unique ID
  const id = nextId++;
  
  // Encode ID to Base62
  const shortUrl = base62.encode(id);

  // Store the mapping
  urlMap.set(shortUrl, url);

  res.json({ shortUrl });
});

// Redirect endpoint for shortened URLs
app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const url = urlMap.get(shortUrl);
  if (!url) {
    return res.status(404).json({ error: 'Shortened URL not found' });
  }
  res.redirect(url);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API route to get product data
app.get('/api/products', (req, res) => {
  fs.readFile('./products.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read product data' });
    res.json(JSON.parse(data));
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

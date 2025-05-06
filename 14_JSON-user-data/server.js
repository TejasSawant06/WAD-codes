const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get users data
app.get('/api/users', (req, res) => {
  const usersFilePath = path.join(__dirname, 'users.json');
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ error: 'Unable to read users data' });
    }
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (parseErr) {
      console.error('Error parsing users JSON:', parseErr);
      return res.status(500).json({ error: 'Invalid users data format' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/posts', (req, res) => {
  const posts = [
    { id: 1, title: 'Learning AJAX with Express' },
    { id: 2, title: 'Node.js makes backend simple' },
    { id: 3, title: 'Express + Fetch = HIII' }
  ];
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
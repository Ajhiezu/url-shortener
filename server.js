const express = require('express');
const cors = require('cors');
const dns = require('dns');
const urlParser = require('url');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

let urlDatabase = [];
let id = 1;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  const hostname = urlParser.parse(url).hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    const short_url = id++;
    urlDatabase.push({ original_url: url, short_url });
    res.json({ original_url: url, short_url });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const entry = urlDatabase.find(obj => obj.short_url === shortUrl);

  if (entry) {
    res.redirect(entry.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

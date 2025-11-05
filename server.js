// Simple proxy server for scripture.api.bible
// Designed to be compatible with deployment on Vercel or any Node 14+ host.
// Uses only features compatible with older environments.
var express = require('express');
var fetch = require('node-fetch');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());

// Require API key in environment variable: SCRIPTURE_API_BIBLE_KEY
var API_KEY = process.env.SCRIPTURE_API_BIBLE_KEY || null;
if (!API_KEY) {
  console.log("WARNING: SCRIPTURE_API_BIBLE_KEY is not set. Requests will return 400 until you set it.");
}

// Safe proxy: forwards calls to https://api.scripture.api.bible/v1/<path>
// Example: /api/proxy?path=bibles/{BIBLE_ID}/books
app.get('/api/proxy', function (req, res) {
  if (!API_KEY) {
    return res.status(400).json({ error: "Server missing SCRIPTURE_API_BIBLE_KEY environment variable." });
  }
  var path = req.query.path;
  if (!path) {
    return res.status(400).json({ error: "Missing 'path' query parameter. Example: /api/proxy?path=bibles/{BIBLE_ID}/books" });
  }
  // very light validation: allow only certain characters
  if (!/^[A-Za-z0-9_\-\/\?\=\&\%\.\,]+$/.test(path)) {
    return res.status(400).json({ error: "Invalid path characters." });
  }
  var url = 'https://api.scripture.api.bible/v1/' + path;
  // forward to scripture.api.bible
  fetch(url, {
    headers: { 'api-key': API_KEY }
  }).then(function(response) {
    // forward status and json/text
    var contentType = response.headers.get('content-type') || '';
    if (contentType.indexOf('application/json') !== -1) {
      return response.json().then(function(body){ res.status(response.status).json(body); });
    } else {
      return response.text().then(function(body){ res.status(response.status).send(body); });
    }
  }).catch(function(err){
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy fetch failed", details: String(err) });
  });
});

// Health
app.get('/api/health', function(req, res){
  res.json({ status: "ok" });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Bible proxy backend listening on port " + port);
});
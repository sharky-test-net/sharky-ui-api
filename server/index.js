'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// This should go before all else.
app.use((req, res, next) => {
  const host = req.get('host');

  // We only care about https for prod site.
  if (!host.match(/^api\.sharky-test\.net/)) {
    next();
    return;
  }

  // Tell the browser that next time it should always use https.
  res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains;');

  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    // Redirect to https.
    res.redirect('https://' + host + req.url);
  } else {
    // Already https; don't do anything special.
    next();
  }
});

app.get('/ping', (req, res) => {
  res.send('OK\n');
});

app.get('*', (req,res) => {
  res.send('Hello, world!\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

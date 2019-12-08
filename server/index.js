'use strict';

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cors = require('cors')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const clientID = '4f7a518f8ff6d9afa025';
const clientSecret = 'c19036a51a44f03a22febc327b80ca78c14cbc1c';
const jwtSecret = '2tfy$Dr439XnD9fR';

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

app.use(cors());

app.get('/ping', (req, res) => {
  res.send('OK\n');
});

app.get('/login', (req, res) => {
  if(req.query.code) {
    axios
      .post(
        'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',
        {
          client_id: clientID,
          client_secret: clientSecret,
          code: req.query.code,
          accept: 'json'
        },
        {
          headers: { "X-Requested-With": "XMLHttpRequest" }
        }
      )
      .then(githubRes => {
        if (githubRes && githubRes.data && githubRes.data.access_token) {
          return githubRes.data.access_token;
        } else {
          res.status(403).send(githubRes.data.error_description);
        }
      })
      .then(accessToken => axios.get('https://api.github.com/user?access_token=' + accessToken))
      .then(userInfo => {
        console.log(userInfo.data.email);
        res.send({ token: jwt.sign({ email: userInfo.data.email }, jwtSecret), email: userInfo.data.email});
      })
      .catch();
  }
})

app.get('*', (req,res) => {
  res.send('Hello, world!\n');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

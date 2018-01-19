require('dotenv').config()
require ('newrelic');

var compression = require('compression');
var cors = require('cors');
var express = require('express');
var request = require('request');

var app = express();

app.set('view engine', 'ejs')

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.get('/authorize', function (req, res) {
  var url = "https://github.com/login/oauth/authorize?response_type=code&client_id=" +
    process.env.GITHUB_CLIENT_ID +
    "&scope=repo%2Cread%3Aorg&redirect_uri=" + process.env.GITHUB_CALLBACK_URL

  res.redirect(url);
})

app.get('/oauth-callback', function(req, res) {
  var code = req.query.code
  request.post(
    {
      url: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      json: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }
    },
    function(err, githubRes, body) {
      res.render('oauth-callback', { token: body.access_token });
    }
  );
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.info(`Node Version: ${process.version}`);
  console.log('Pipefy app Server listening on port ' + listener.address().port);
});

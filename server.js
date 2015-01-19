var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Q = require('q'),
    fs = require('fs'),
    url = require('url'),
    store = require('./logstore');

var app = express();

app.use( cors() );
app.use( bodyParser.json() );

app.post('/log', function(req, res, next) {
  var qstr = url.parse(req.url, true).query;
  var user = qstr.user;
  var hash = qstr.hash;
  // console.log ("%s %s", user, hash);
  if (!req.body) {
    res.status(400).send("Request body was empty!");

  } else {
    var events = req.body;
    store(user, events).then(function() {
      res.status(200).send("Done!");
    }, function(error) { // if something went wrong
      res.status(500).send("Error! " + error);
    });

  }
});

function start() {
  var port = process.env.PORT || 9250;
  var server = app.listen(port);
  console.log('Server listening at http://%s:%s in %s mode', server.address().address, server.address().port, app.settings.env);
}

exports.start = start;
exports.app = app;

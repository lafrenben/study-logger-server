var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    url = require('url'),
    store = require('./logstore');

module.exports = function() {

  var logroute = express.Router();

  logroute.use( cors() );
  logroute.use( bodyParser.json() );

  logroute.post('/log', function(req, res, next) {
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
  
  return logroute;

}();
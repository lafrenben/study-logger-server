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
    var user = req.query.user;
    var auth = req.query.auth;
    console.log ("%s %s", user, auth);
    if (!req.body) {
      res.status(400).send({
	error: "Request body was empty!"
      });

    } else {
      var events = req.body;
      store(user, events).then(function() {
	res.status(200).send({ 
	  message: "Done!"
	});
      }, function(error) { // if something went wrong
	res.status(500).send({
	  error: error
	});
      });

    }
  });
  
  return logroute;

}();
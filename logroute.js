var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    url = require('url'),
    store = require('./logstore');

function createLogRoute(options) {
  
  var logdir;
  if (options && options.logdir) {
    logdir = options.logdir;
  } else {
    logdir = './data';
  }

  var logroute = express.Router();

  logroute.use( cors() );
  logroute.use( bodyParser.json() );

  logroute.post('/log', function(req, res, next) {
    var user = req.query.user;
    var auth = req.query.auth;
    // console.log ("%s %s", user, auth);
    if (!req.body) {
      res.status(400).send({
	error: "Request body was empty!"
      });

    } else {
      var events = req.body;
      store(user, events, logdir).then(function() {
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
}

module.exports = createLogRoute;

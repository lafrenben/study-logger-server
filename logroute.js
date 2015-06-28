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

  var authFunc;
  if (options && options.auth) {
    authFunc = options.auth;
  } else {
    authFunc = false;
  }

  var logroute = express.Router();

  logroute.use( cors() );
  logroute.use( bodyParser.json() );

  logroute.post('/log', function(req, res, next) {
    var user = req.query.user;
    var auth = req.query.auth;

    if (authFunc && (authFunc(user, auth) === false)) {
      return res.status(403).send({
	error: "Unauthorized user or authentication."
      });
    }

    if (!req.body) {
      res.status(400).send({
	error: "Request body was empty!"
      });

    } else {
      var events = req.body;
      store(user, events, logdir, function(err) {
	// console.log("Error is " + err);
	if (err !== null) {
	  res.status(500).send({
	    error: err
	  });

	} else {
	  res.status(200).send({ 
	    message: "Done!"
	  });
	}
      });
    }
  });

  return logroute;
}

module.exports = createLogRoute;

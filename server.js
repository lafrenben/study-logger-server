var express = require('express'),
    logroute = require('./logroute');

var app = express();

app.use('/', logroute);

function start() {
  var port = process.env.PORT || 9250;
  var server = app.listen(port);
  console.log('Server listening at http://%s:%s in %s mode', server.address().address, server.address().port, app.settings.env);
}

exports.start = start;
exports.app = app;

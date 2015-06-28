var assert = require('chai').assert,
    should = require('chai').should,
    expect = require('chai').expect,
    sqlite3 = require('sqlite3').verbose(),
    fs = require('fs'),
    store = require('../logstore'),
    path = require('path');

var user = 'TestUser';
var testDbDir = 'data';
var testDbFile = path.join(testDbDir, 'TestUser.db');
var events = [{timestamp: 123,
	       type: "event.testevent",
	       startdate: "2015-01-01"},
	      {timestamp: 124,
	       type: "event.testevent",
	       startdate: "2015-01-01"}];

describe('LogStore', function() {

  beforeEach(function(done) {
    if (fs.existsSync( testDbFile )) {
      fs.unlinkSync( testDbFile );
    }
    done();
  });

  afterEach(function(done) {
    if (fs.existsSync( testDbFile )) {
      fs.unlinkSync( testDbFile );
    }
    done();
  });

  it('automatically creates a database file on first insert', function(done) {
    store(user, events, testDbDir, function(err) {
      assert(err === null, 'No errors');
      assert(fs.existsSync( testDbFile ), 'Database file exists');
      done();
    });
  });

  it('successfully inserts events into the database', function(done) {
    store(user, events, testDbDir, function(err) {
      assert(err === null, 'No errors');

      var db = new sqlite3.Database( testDbFile );

      db.all('SELECT event FROM events ORDER BY id ASC', function(err, rows) {
      	assert(!err, "No errors when trying to read back");
      	if (!err) {
      	  var outEvents = [];
      	  for (var i = 0; i < rows.length; i++) {
      	    outEvents.push( JSON.parse(rows[i].event) );
      	  }
	  // console.log(outEvents);
      	  assert(rows.length === 2, 'Must return 2 rows');
      	  assert.deepEqual(events, outEvents, 'Must match the inserted data');
      	}
      });

      db.close(function(err) {
	done();
      });

    });
  });

  it('can insert events into an existing database', function(done) {
    var events2 = [{timestamp: 125,
  		   type: "event.testevent",
  		   startdate: "2015-01-01"},
  		  {timestamp: 126,
  		   type: "event.testevent",
  		   startdate: "2015-01-01"}];
    store(user, events, testDbDir, function(err) {
      store(user, events2, testDbDir, function(err) {

	var db = new sqlite3.Database( testDbFile );

	db.all('SELECT event FROM events ORDER BY id ASC', function(err, rows) {
      	  assert(!err, "No errors when trying to read back");
      	  if (!err) {
      	    var outEvents = [];
      	    for (var i = 0; i < rows.length; i++) {
      	      outEvents.push( JSON.parse(rows[i].event) );
      	    }
	    // console.log(outEvents);
      	    assert(rows.length === 4, 'Must return 4 rows');
      	    assert.deepEqual(events.concat(events2), outEvents, 'Must match the inserted data');
      	  }
	});

	db.close(function(err) {
	  done();
	});

      });
    });
  });

});

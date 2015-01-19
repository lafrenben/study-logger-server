var assert = require('chai').assert,
    should = require('chai').should,
    expect = require('chai').expect,
    fs = require('fs'),
    qsql = require('q-sqlite3'),
    store = require('../logstore');

var user = 'TestUser';
var testDbFile = 'data/TestUser.db';
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
    store(user, events).then(function() {
      assert(fs.existsSync( testDbFile ), 'Database file exists');
    }).done(done);
  });

  it('successfully inserts events into the database', function(done) {
    store(user, events).then(function() {
      return qsql.createDatabase( testDbFile ).then(function(db) {
      	return db.all('SELECT event FROM events ORDER BY id ASC').then(function(rows) {
      	  var outEvents = [];
      	  for (var i = 0; i < rows.length; i++) {
      	    outEvents.push( JSON.parse(rows[i].event) );
      	  }
      	  assert(rows.length === 2, 'Must return 2 rows');
      	  assert.deepEqual(events, outEvents, 'Must match the inserted data');
	  return db.close();
      	});
      });
    }).done(done);
  });

  it('can insert events into an existing database', function(done) {
    var events2 = [{timestamp: 125,
		   type: "event.testevent",
		   startdate: "2015-01-01"},
		  {timestamp: 126,
		   type: "event.testevent",
		   startdate: "2015-01-01"}];
    store(user, events)
      .then(function() {
	return store(user, events2);
      })
      .then(function() {
	return qsql.createDatabase( testDbFile ).then(function(db) {
      	  return db.all('SELECT event FROM events ORDER BY id ASC').then(function(rows) {
      	    var outEvents = [];
      	    for (var i = 0; i < rows.length; i++) {
      	      outEvents.push( JSON.parse(rows[i].event) );
      	    }
      	    assert(rows.length === 4, 'Must return 4 rows');
      	    assert.deepEqual(events.concat(events2), outEvents, 'Must match the inserted data');
	    return db.close();
      	  });
	});
      }).done(done);

  });
});

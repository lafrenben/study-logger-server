var sqlite3 = require('sqlite3').verbose(),
    path = require('path');

function store(user, events, dir, callback) {

  var db = new sqlite3.Database(path.join(dir, user + '.db'));

  db.serialize(function() {
    db.run('CREATE TABLE IF NOT EXISTS events ' +
	   '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
	   '"user" VARCHAR(255) NOT NULL, ' +
	   '"timestamp" INTEGER NOT NULL, ' +
	   '"event" TEXT NOT NULL) ', function(err) {
	     // console.log("DB create happens");
	     if (err !== null) {
	       callback(err);
	     }
	   });

    var stmt = db.prepare('INSERT INTO events(user, timestamp, event) VALUES(?,?,?)', function(err) {
      // console.log("DB prepare happens");
      if (err) {
	callback(err);
      }
    });
    
    for (var i = 0; i < events.length; i++) {
      stmt.run(user, events[i].timestamp, JSON.stringify(events[i]), function(err) {
	// console.log("DB Stmt run happens");
	if (err) {
	  callback(err);
	}
      });
    }
    stmt.finalize(function(err) {
      // console.log("DB Stmt finalize happens");
      if (err) {
	callback(err);
      }
    });
  });

  db.close(function(err) {
    // console.log("DB Close happens");
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });

}

module.exports = store;

var qsql = require('q-sqlite3'),
    Q = require('q');

function store(user, events) {

  return qsql.createDatabase('data/' + user + '.db')
    .then(function (db) {
      return db.run('CREATE TABLE IF NOT EXISTS events ' +
		    '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
		    '"user" VARCHAR(255) NOT NULL, ' +
		    '"timestamp" INTEGER NOT NULL, ' +
		    '"event" TEXT NOT NULL) ')
	.then(function () {
	  return db.prepare('INSERT INTO events(user, timestamp, event) VALUES(?,?,?)');
	})
	.then(function (stmt) {
	  var inserts = [];
	  for (var i = 0; i < events.length; i++) {
	    inserts.push(stmt.run(user, events[i].timestamp, JSON.stringify(events[i])));
	  }
	  var result = Q(true);
	  inserts.forEach(function(f) {
	    result = result.then(f);
	  });
	  return result.then(function() {
	      return stmt.finalize();
	  });
	})
	.then(function () {
	  return db.close();
	});
    });

}

module.exports = store;
var assert = require('assert'),
    should = require('chai').should,
    expect = require('chai').expect,
    request = require('supertest'),
    app = require('../server').app;

describe('Server', function() {

  // before(function(done) {
  // });

  // after(function(done) {
  // });

  it('can accept a POST of log events', function(done) {

    var events = [{timestamp: 123,
		   type: "event.testevent",
		   startdate: "2015-01-01"}];
    request(app)
      .post('/log?user=TestUser&hash=0')
      .send(events)
      .end(function(err, res) {
	expect(res.status).to.equal(200);
	expect(err).to.be.null();
	expect(res.body.message).to.equal("Done!");
	done();
      });
  });

  it('rejects requests from non-whitelisted usernames', function(done) {

    var events = [{timestamp: 123,
		   type: "event.testevent",
		   startdate: "2015-01-01"}];
    request(app)
      .post('/log?user=ShadyGuy&hash=No')
      .send(events)
      .end(function(err, res) {
	expect(res.status).to.equal(400);
	expect(err).not.to.be.null();
	done();
      });

  });

});
var assert = require("assert");
var should = require("should");
var Connect = require("../");
var Start = require("fxos-start");
var Q = require('q');


describe('fxos-connect', function(){

  describe('when no simulator is open', function(){

    it('should start a simulator', function(done) {
      Connect()
        .then(function(sim) {
          process.kill(sim.pid);
          sim.pid.should.be.type('number');
          sim.port.should.be.type('number');
          sim.release.should.be.type('string');
        })
        .then(done)
        .fail(done);
    });

    it('should match given release', function(done) {
      Connect({release:['2.1']})
        .then(function(sim) {
          process.kill(sim.pid);
          sim.release.should.equal('2.1');
        })
        .then(done)
        .fail(done);
    });

    it('should match given port', function(done) {
      Connect({port:8081})
        .then(function(sim) {
          process.kill(sim.pid);
          sim.port.should.equal(8081);
        })
        .then(done)
        .fail(done);
    });
  });

  describe('when a simulator is open', function(){

    it('should find a simulator', function(done) {
      var starting = Start({
        connect:false,
        force:true
      });
      var connecting = starting.then(function(sim) {
        return Connect();
      });

      Q.all([connecting, starting])
        .spread(function(sim1, sim2) {
          process.kill(sim1.pid);
          sim1.pid.should.equal(sim2.pid);
        })
        .then(done)
        .fail(done);
    });

    it('should reuse if release matches', function(done) {
      var starting = Start({
        connect:false,
        force: true,
        release: ['2.1']
      });
      var connecting = starting.then(function(sim) {
        return Connect();
      });

      Q.all([connecting, starting])
        .spread(function(sim1, sim2) {
          process.kill(sim1.pid);
          var regex = new RegExp("^(" + sim2.release + ")");
          assert(regex.exec(sim1.release));
        })
        .then(done)
        .fail(done);
    });


    it('should reuse if port matches', function(done) {
      var starting = Start({
        connect:false,
        force: true,
        port: 8081
      });
      var connecting = starting.then(function(sim) {
        return Connect();
      });

      Q.all([connecting, starting])
        .spread(function(sim1, sim2) {
          process.kill(sim1.pid);
          sim1.port.should.equal(sim2.port);
        })
        .then(done)
        .fail(done);
    });

  });
});
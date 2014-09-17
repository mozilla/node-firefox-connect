var FXPorts = require('fx-ports');
var FXOSStart = require('fxos-start');
var Q = require('q');
var __ = require('underscore');
var FirefoxClient = require('firefox-client');

module.exports = Connect;

function findSimulator(opts) {
  return Q.nfcall(FXPorts, {
      b2g: true,
      release: opts.release,
      detailed: true
    })
    .then(function (sims) {
      if (sims.length) {
        // if port wanted and found a matching release
        if (opts.port) {
          var ports = sims.map(function(b) { return b.port; });
          var index = ports.indexOf(opts.port);
          if (index != -1) {
            return sims[index];
          }
        }
        // if no port wanted and found a matching release
        else {
          return sims[0];
        }
      }
      return false;
    });
}

function createClient (simulator) {
  var deferred = Q.defer();
  var client = new FirefoxClient();
  client.connect(simulator.port, function (err) {
    if (err) deferred.reject(err);
    simulator.client = client;
    deferred.resolve(simulator);
  });
  return deferred.promise;
}

function Connect (opts, callback) {

  if (typeof opts == 'function') {
    callback = opts;
    opts = {connect: true};
  } else {
    opts = opts ? __.clone(opts) : {};
  }

  // restart determines if there is a need to restart a simulator
  // which is when we want to use a specific simulator bin/profile
  // or we want to attach to the child process
  var restart;
  if (opts.stderr || opts.stdin ||
      opts.stdout || opts.verbose ||
      opts.bin || opts.profile) {
    restart = true;
    opts.force = true;
  }

  var reuseSimulator = restart ? false : findSimulator(opts);
  return Q(reuseSimulator)
    .then(function (sim) {
      var args = __(__.clone(opts)).extend({connect: false});
      return sim || FXOSStart(args);
    })
    .then(function (sim) {
      return opts.connect ? createClient(sim) : sim;
    })
    .then(
      function(sim) {
        if (callback) callback(null, sim);
        return sim;
      },
      function(err) {
        if (callback) callback(err);
        return err;
      }
    );
}

var discoverPorts = require('fx-ports');
var start = require('fxos-start');
var Q = require('q');
var __ = require('underscore');
var FirefoxClient = require('firefox-client');

module.exports = Connect;

function discoverPortPromise (opts) {
  var deferred = Q.defer();
  discoverPorts(opts, deferred.makeNodeResolver());
  return deferred.promise;
}

function Connect() {
  var args = arguments;
  var opts = {};
  var callback;

  /* Overloading */

  // Connect(opts [, callback])
  if (typeof args[0] == 'object') {
    opts = __.clone(args[0]);
  }

  // Connect(..., callback)
  if (typeof args[args.length-1] == 'function') {
    callback = args[args.length-1];
  }

  // Connect({port: 3200})
  // Connect({release: 2.1})

  var needsStart = false;
  if (opts.stderr || opts.stdin ||
      opts.stdout || opts.verbose ||
      opts.bin || opts.profile) {
    needsStart = false;
    opts.force = true;
  }

  // If it is passing the client, then noop!
  if (opts.client && !needsStart) {
    return Q(opts);
  }

  var portReady = discoverPortPromise({
    b2g:true,
    release:opts.release,
    detailed: true
  });

  var canReusePort = portReady
    .then(function(b2gs) {  
      var canReuseSim = false;

      if (b2gs.length) {
        // if port wanted and found a matching release
        if (opts.port) {
          var ports = b2gs.map(function(b) {
            return b.port;
          });
          var index = ports.indexOf(opts.port);
          if (index != -1) {
            canReuseSim = b2gs[index];
          }
        }
        // if no port wanted and found a matching release
        else {
          canReuseSim = b2gs[0];
        }
      }
      return canReuseSim;
    });

  var simulatorReady = canReusePort.then(function(canReuseSim) {

      // if something requires owning the process
      if (canReuseSim && !needsStart) {
        return canReuseSim;
      }

      return start(__.extend(opts, {connect:false}))
        .then(function(simulator) {
          return simulator;
        });
    });

    if (opts.connect) {
      return simulatorReady
        .then(function(simulator) {
          var deferred = Q.defer();
          simulator.client = new FirefoxClient();
          simulator.client.connect(simulator.port, function(err) {
            if (err) deferred.reject(err);
            deferred.resolve(simulator);
          });
          return deferred.promise;
        });

    }

  return simulatorReady;
}

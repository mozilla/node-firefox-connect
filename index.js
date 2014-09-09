var discoverPorts = require('fx-ports');
var start = require('fxos-start');
var Q = require('q');
var __ = require('underscore');

module.exports = Connect;

function discoverPortPromise (opts) {
  console.log(opts)
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
  var portReady = discoverPortPromise({b2g:true, release:opts.release})
    .then(function(b2gs) {
      console.log(b2gs)
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

      // if something requires owning the process
      if (opts.stderr || opts.stdin ||
          opts.stdout || opts.verbose ||
          opts.bin || opts.profile) {
        canReuseSim = false;
        opts.force = true;
      }

      if (canReuseSim) {
        return canReuseSim;
      }

      return start(opts)
        .then(function(simulator) {
          return simulator;
        });
    });

    return portReady;
}
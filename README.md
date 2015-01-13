# node-firefox-connect

Connects to a Firefox OS Simulator

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

## Install

```sh
# Library
$ npm install fxos-connect
```

## Usage

Connects to an existing simulator Start a FirefoxOS simulator and connect to it through [firefox-client](https://github.com/harthur/firefox-client) by returning `client`.

### Callback

```javascript
var connect = require('fxos-connect');
connect({port:1234}, function(err, sim) {
  // Let's show for example all the running apps
  sim.client.getWebapps(function(err, webapps) {
    webapps.listRunningApps(function(err, apps) {
      console.log("Running apps:", apps);
    });
  });
})
```

### Promise

```javascript
var connect = require('fxos-connect');
start({port:1234})
  .then(function(sim) {
    // Let's show for example all the running apps
    sim.client.getWebapps(function(err, webapps) {
      webapps.listRunningApps(function(err, apps) {
        console.log("Running apps:", apps);
      });
    });
  });
```

##History

This is based on initial work on fxos-connect by Nicola Greco.

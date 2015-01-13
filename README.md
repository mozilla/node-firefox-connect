# node-firefox-connect

Connects to a Firefox OS Simulator

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

## Installation

### From git

```sh
git clone https://github.com/mozilla/node-firefox-connect.git
cd node-firefox-connect
npm install
```

If you want to update later on:

```sh
cd node-firefox-connect
git pull origin master
npm install
```

### npm
This module is not on npm yet.

## Usage

Connects to an existing simulator Start a FirefoxOS simulator and connect to it through [firefox-client](https://github.com/harthur/firefox-client) by returning `client`.

### Callback

```javascript
var connect = require('./node-firefox-connect');
connect({ port: 1234 }, function(err, sim) {
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
var connect = require('./node-firefox-connect');
connect({ port: 1234 })
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

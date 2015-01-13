'use strict';

var connect = require('../index');

connect({ port: 1234 }, function(err, sim) {
  var client = sim.client;

  // Let's show for example all the running apps
  client.getWebapps(function(err, webapps) {
    webapps.listRunningApps(function(err, apps) {
      console.log('Running apps:', apps);
    });
  });
});

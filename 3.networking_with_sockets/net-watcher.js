'use strict';

const
  fs = require('fs'),
  net = require('net'),
  filename = process.argv[2],
  server = net.createServer(function(connection) {
    console.log('Suscribber connected');
    connection.write('Watching ' + filename + " for changes!\n");
    
    let watcher = fs.watch(filename, function() {
     connection.write('Change in ' + Date.now() + ".\n");
    });
    
    connection.on('close', function() {
      console.log('Suscriber disconnected');
      watcher.close();
    });
  });

if (!filename) {
  throw Error('No filename');
}

server.listen(5432, function() {
  console.log('Listening...');
});

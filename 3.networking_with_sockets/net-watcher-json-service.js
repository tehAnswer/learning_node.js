'use strict';

const
  fs = require('fs'),
  net = require('net'),
  filename = process.argv[2],
  server = net.createServer(function(connection) {
    console.log('Suscribber connected');
    connection.write(JSON.stringify({
      type: 'watching',
      file: filename
    }) + "\n");
    
    let watcher = fs.watch(filename, function() {
     connection.write(JSON.stringify({
       type: 'change',
       timestamp: Date.now(),
       file: filename
     }) + "\n");
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

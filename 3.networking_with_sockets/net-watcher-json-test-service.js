"use strict";

const
  net = require('net'),
  server = net.createServer(function(connection) {
    console.log('Suscriber connected');
    connection.write('{"type":"change","file": "targ');

    let timer = setTimeout(function() {
      connection.write('et", "timestamp": 1212131333244}' + "\n");
      connection.end();
    }, 1000);

    connection.on('end', function() {
     clearTimeout(timer);
     console.log('Sucriber disconected');
    });
  });

server.listen(5432, function() {
  console.log("test service listening...");
});

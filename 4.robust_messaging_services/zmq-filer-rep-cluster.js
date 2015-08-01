'use strict';

const
  cluster = require('cluster'),
  fs = require('fs'),
  zmq = require('zmq');

if (cluster.isMaster) {
  var router = zmq.socket('router').bind('tcp://127.0.0.1:5433');
  var dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');
  
  router.on('message', function() {
    console.log('[Router] Message recived.');
    let frames = Array.prototype.slice.call(arguments);
    dealer.send(frames);
  });
  
  dealer.on('message', function() {
    console.log('[Dealer] Message recived.');
    let frames = Array.prototype.slice.call(arguments);
    router.send(frames);
  });
  
  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

  for (let i = 0; i < 3; i++) {
   cluster.fork();
  }
 } else {
  
  let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
  responder.on('message', function(data) {
    let request = JSON.parse(data);
    console.log('[' + process.pid + '] Recevided request for: ' + request.path);
    
    fs.readFile(request.path, function(err, data) {
      console.log('[' + process.pid + '] Sending response.');
      responder.send(JSON.stringify({
        pid: process.pid,
        data: data.toString(),
        timestamp: Date.now()
      }));
    });
  });
}

"use strict";

const
  net = require('net'),
  client = net.connect({ port: 5432 });

client.on('data', function(data) {
  let message = JSON.parse(data);
  if (message.type == 'watching') {
    console.log('Now watching: ' + message.file);
  } else if (message.type == 'change') {
    let date = new Date(message.timestamp);
    console.log('Change in ' + date);
  } else {
    throw Error('Unrecognized message: ' + message.type);
  } 
});

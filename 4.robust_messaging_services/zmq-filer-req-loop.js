'use strict';
const
  zmq = require('zmq'),
  filename = process.argv[2],
  requester = zmq.socket('req');

requester.on('message', function(data) {
  let response = JSON.parse(data)
  console.log("Recived response: ", response);
});

requester.connect("tcp://localhost:5433");

for (let i = 0; i <= 2; i++) {
  console.log("Sending request for " + filename);
  requester.send(JSON.stringify({
    path: filename
  }));
}

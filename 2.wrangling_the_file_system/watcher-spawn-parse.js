"use strict";
const
  fs = require('fs'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

if(!filename) {
  throw Error('Really? Please, a file must be watch...');
}

fs.watch(filename, function () {
  let ls = spawn('ls', ['-lh', filename]);
  let output = '';
  
  ls.stdout.on('data', function(data) {
    output += data.toString();
  });

  ls.on('close', function() {
    let parts = output.split(/\s+/);
    console.dir([parts[0], parts[4], parts[8]]);
  });  
});

console.log('Watching a file...');

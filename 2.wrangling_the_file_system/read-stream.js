const
  fs = require('fs'),
  stream = fs.createReadStream(process.argv[2]);

stream.on('data', function(data) {
  process.stdout.write(data);
});

stream.on('error', function(err) {
  process.stderr.write('ERROR: ' + err.message + "\n")
});

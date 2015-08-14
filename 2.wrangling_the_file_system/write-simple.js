const
  fs = require('fs'),
  filename = process.argv[2],
  message = process.argv[3];

if (!filename || !message) {
  throw Error('Provide a filename and the message!');
}

fs.writeFile(filename, message, function (err) {
  if(err) {
    throw err;
  }
  console.log(filename + " saved.");
});

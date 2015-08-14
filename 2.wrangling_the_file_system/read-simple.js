const
  fs = require('fs'),
  filename = process.argv[2];

if(!filename) {
  throw Error('Filename required!!!!');
}

fs.readFile(filename, function (err,data) {
  if(err) {
    throw err;
  }
  console.log('Content of ' + filename);
  console.log(data.toString());
});

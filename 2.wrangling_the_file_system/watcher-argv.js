const
  fs = require('fs'),
  filename = process.argv[2];

if(!filename) {
  throw Error('Really? Please, a file must be watch...');
}

fs.watch(filename, function () {
  console.log(filename + ' has just changed!!!! OMFG.');
});

console.log('Watching a file...');

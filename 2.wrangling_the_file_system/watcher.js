const fs = require('fs');

fs.watch('target.txt', function () {
  console.log('OMFG the file just changed!!!!!');
});

console.log('Watching target.txt...');

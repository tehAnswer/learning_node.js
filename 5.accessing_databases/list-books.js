'use strict';
const
  file = require('file'),
  rdfParser = require('./lib/rdf-parser.js');

console.log('Crawlin all day loooong...');
file.walk(__dirname + '/cache', function(err, dirPath, dirs, files) {
  files.forEach(function(path) {
    rdfParser(path, function(err, doc) {
      if (err) {
        throw err;
      } else {
        console.log(doc);
      }
    });
  });
});  

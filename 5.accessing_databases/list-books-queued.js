'use strict';
const
  async = require('async'),
  file = require('file'),
  rdfParser = require('./lib/rdf-parser.js'),
  request = require('request');

var parserCallback = function(err, doc, done) {
  if(typeof(doc) === "undefined") {
    done();
  } else {
    storeRecord(doc);
    done();
  }
};

var storeRecord = function(doc, done) {
  request({
   method: 'PUT',
   url: 'http://localhost:5984/books/' + doc._id,
   json: doc
  }, function(err, res, body) {
    if(err) {
      throw Error(err);
    }
    console.log(res.statusCode, body);
  });
};

var work = async.queue(function(path, done) {
  rdfParser(path, function(err, doc) {
   parserCallback(err, doc, done);
  });
}, 1000);

console.log("Crawlin' all day looong, hooooomie");
file.walk(__dirname + '/cache', function(err, dirPath, dirs, files) {
  files.forEach(function(path) {
    work.push(path);
  });
});

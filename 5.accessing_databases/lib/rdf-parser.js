'use strict';
 const
  fs = require('fs'),
  cheerio = require('cheerio');

module.exports = function(filename, callback) {
  fs.readFile(filename, function(err, data) {
    if(err) {
      return callback(err);
    } 
    let
      $ = cheerio.load(data.toString(), { xmlMode: true }),
      authorsList = [],
      subjectList = [],
      pushAuthors = function(index, element) {
        authorsList.push($(element).text());
      },
      pushSubjects = function(index, element) {
        subjectList.push($(element).text());
      };

      $('pgterms\\:agent pgterms\\:name').map(pushAuthors);
      $('[rdf\\:resource$="/LCSH"] ~ rdf\\:value').map(pushSubjects);

     callback(null, {
       _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
       title: $('dcterms\\:title').text(),
       authors: authorsList,
       subjects: subjectList
     });
  });
};

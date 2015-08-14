#!/usr/bin/env node --harmony

'use strict';

const
  async = require('async'),
  request = require('request'),
  views = require('./lib/views.js');

async.waterfall([
  function(next) {
    request.get('http://localhost:5984/books/_design/books', next);
  },
  function(response, body, next) {
    var body = response.statusCode == 200 ? JSON.parse(body) : { views: { } };
    next(null, body);
  },
  function(doc, next) {
    Object.keys(views).forEach(function(name) {
      doc.views[name] = views[name];
    });
    request({
      method: 'PUT',
      url: 'http://localhost:5984/books/_design/books',
      json: doc
    }, next);
  }
], function(err, response, body) {
  if(err) { throw err; }
  console.log(response.statusCode, body);
});

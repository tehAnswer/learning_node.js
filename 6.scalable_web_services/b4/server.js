#!/usr/bin/env node --harmony
'use strict';
const
  express = require('express'),
  app = express(),
  logger = require('morgan');

app.use(logger('combined'));


const config = {
  bookdb: 'http://127.0.0.1:5984/books/',
  b4db: 'http://127.0.0.1:5984/b4/'
};

//require('./lib/book-search.js')(config, app);
require('./lib/field-search.js')(config, app);
require('./lib/bundle.js')(config, app);

app.listen(3000, function() {
  console.log("listenin' all day long homie watchu back homie this is the javascript ghetto.");
});

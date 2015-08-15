#!/usr/bin/env node --harmony
'use strict';
const
  express = require('express'),
  app = express(),
  logger = require('morgan');

app.use(logger('combined'));
app.get('/api/:name', function(req, res) {
  res.json(200, { "message": req.params.name + " wazz up hooomie." });
});

app.listen(3000, function() {
  console.log("Listenin' 3000 all day loooong homie");
});

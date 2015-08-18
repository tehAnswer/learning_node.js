'use strict';

const
  Q = require('q'),
  request = require('request');

var callback = function(err, dbRes, body, promise) {
  if(err) {
    promise.reject(err);
  } else {
    promise.resolve([dbRes, body]);
  }
};

var queryParams = function(config, request) {
  return  {
    url: config.b4db,
    json: {
      type: 'bundle',
      name: request.query.name,
      books: {}
    }
  };
};

module.exports = function(config, app) {
  app.post('/api/bundle', function(req, res) {
    var deferred = Q.defer();
    request.post(queryParams(config, req), function (err, dbRes, body) {
      callback(err, dbRes, body, deferred);
      deferred.promise.then(function(args) {
        let couchRes = args[0], body = args[1];
        res.json(couchRes.statusCode, body);
      }, function(err) {
        res.json(502, { "error" : "bad_gateway" , "reason": err.code }); 
      });
    });
  });

  app.get('/api/bundle/:id', function(req, res) {
    var promise = Q.nfcall(request.get, config.b4db + '/' + req.params.id);
    var result = promise.then(function(args) {
      let couchRes = args[0], body = JSON.parse(args[1]);
      res.json(couchRes.statusCode, body);
    }, function(err) {
      res.json(502, { error: "bad_gateway", reason: err.code })
    });
    result.done();
  });
};

'use strict';

const
  Q = require('q'),
  request = require('request');

var resolvePromise = function(err, dbRes, body, promise) {
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

function getResponseCallbacks(response) {
  var successHook = function(args) {
    var couchRes = args[0];
    var body = JSON.parse(JSON.stringify(args[1]));
    response.status(couchRes.statusCode).json(body);
  };

  var failureHook = function(err) {
    response.status(502).json({ "error" : "bad_gateway" }); 
  }

  return [successHook, failureHook];
};

module.exports = function(config, app) {
  app.post('/api/bundle', function(req, res) {
    var deferred = Q.defer();
    request.post(queryParams(config, req), function (err, dbRes, body) {
      resolvePromise(err, dbRes, body, deferred);
      var callbacks = getResponseCallbacks(res);
      deferred.promise.then(callbacks[0], callbacks[1]);
    });
  });

  app.get('/api/bundle/:id', function(req, res) {
    var promise = Q.nfcall(request.get, config.b4db + '/' + req.params.id);
    var callbacks = getResponseCallbacks(res);
    var result = promise.then(callbacks[0], callbacks[1]);
    result.done();
  });

  app.put('/api/bundle/:id/name/:name', function(req, res) {
    var promise = Q.nfcall(request.get, config.b4db + '/' + req.params.id);
    var promiseChain = promise.then(function(args) {
      let couchRes = args[0], bundle = JSON.parse(args[1]);
      if(couchRes.statusCode != 200) {
        return [couchRes, bundle];
      }

      bundle.name = req.params.name;
      return Q.nfcall(request.put, {
        url: config.b4db + '/' + req.params.id,
        json: bundle
      });
    });
    var callbacks = getResponseCallbacks(res);
    var result = promiseChain.then(callbacks[0], callbacks[1]);
    result.done();
  });
};

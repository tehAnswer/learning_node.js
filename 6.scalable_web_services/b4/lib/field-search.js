'use strict';

const request = require('request');

var hash = function(config, req) {
  return {
    method: 'GET',
    url: config.bookdb + '_design/books/_view/by_' + req.params.view,
    qs: {
      startKey: JSON.stringify(req.query.q),
      endkey: JSON.stringify(req.query.q + "\ufff0"),
      group: true
    }
  };
};

var render_callback = function(err, response, couchResponse, body) {
  if(err) {
    response.json(502, { 'error': 'bad_gateway', reason: err.code});
    return ;
  }

  if(couchResponse.statusCode != 200) {
    response.json(couchResponse.statusCode, JSON.parse(body));
    return ;
  }

  response.json(JSON.parse(body).rows.map(function(element) {
    return element.key;
  }));
};

module.exports = function(config, app) {
  app.get('/api/search/:view', function(req, res) {
    request(hash(config, req), function(err, couchRes, body) {
      render_callback(err, res, couchRes, body);
    });
  });
}

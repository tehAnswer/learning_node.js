const
  events = require('events'),
  util = require('util'),
  LDJClient = function(stream) {
    events.EventEmitter.call(this);
    var that = this;
    var buffer = '';
    stream.on('data', function(data) {
      buffer += data;
      while (buffer.indexOf("\n") !== -1) {
        var limit = buffer.indexOf("\n");
        var input = buffer.substr(0, limit);
        buffer = buffer.substr(limit + 1);
        that.emit('message', JSON.parse(input));
      }
  });
}

util.inherits(LDJClient, events.EventEmitter);

exports.LDJClient = LDJClient;
exports.connect = function(stream) {
  return new LDJClient(stream);
};

var connect = function(cb) {
  window.pomelo.init({
    host: '127.0.0.1',
    port: '3010'
  }, function() {
    console.log('connect success!');

    cb();
  });
};

describe("WebSocket", function() {
  var pomelo = window.pomelo;

  it("should can connect to socket server", function() {
    connect(function() {
      pomelo.request('connector.entryHandler.entry', {msg: 'test message'}, function(data) {
        console.log('response: ', data);
      });
    });
  });
});
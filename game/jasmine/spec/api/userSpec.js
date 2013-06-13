var connect = function(cb) {
  window.pomelo.init({
    host: '127.0.0.1',
    port: '3010'
  }, function() {
    console.log('connect success!');

    cb();
  });
};

describe("User Actions", function() {
  var pomelo = window.pomelo;

  describe("注册", function() {
    it("注册一个新的用户", function() {
      connect(function() {
        pomelo.request('connector.entryHandler.entry', {
          email: '175040128@qq.com',
          password: '1'
        }, function(data) {
          console.log(data);
          //expect(true).toEqual(false);
        });

        pomelo.on('onChart', function(data){
          console.log('onChart:', data);
        });
      });
    });
  });
});
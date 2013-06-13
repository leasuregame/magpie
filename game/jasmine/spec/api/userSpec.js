describe("User Actions", function() {
  var pomelo = window.pomelo;
  var inited = false;

  var request = function(route, msg, cb){
    var ok = false;
    runs(function(){
      pomelo.request(route, msg, function(data){
        ok = true;
        cb(data);
      });
    });

    waitsFor(function(){return ok;});
  };

  beforeEach(function(){
    runs(function(){
      pomelo.init({
        host: '127.0.0.1',
        port: '3010'
      }, function() {
        console.log('connect success!');
        inited = true;
      });
    });
    waitsFor(function(){return inited;});
  });

  describe("Entry Handler", function() {
    it("entry method should works fine.", function() {
      request('connector.entryHandler.entry', {}, function(data){
        expect(data).toEqual({code: 200, msg: "game server is ok"});
      });
    });
  });
});
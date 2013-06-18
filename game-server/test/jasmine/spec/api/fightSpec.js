describe("Message # ", function() {
  var pomelo = window.pomelo;
  var inited = false;
  var userid;

  var request = function(route, msg, cb) {
    var ok = false;
    runs(function() {
      pomelo.request(route, msg, function(data) {
        ok = true;
        cb(data);
      });
    });

    waitsFor(function() {
      return ok;
    });
  };

  var intiPomelo = function() {
    runs(function() {
      pomelo.init({
        host: '127.0.0.1',
        port: '3010'
      }, function() {
        console.log('connect success!');
        inited = true;

        pomelo.on('onMessage', function(data) {
          console.log('***** on message: ', data);
        });
        pomelo.on('onLogin', function(data) {
          console.log('***** on login: ', data);
        });
      });
    });
    waitsFor(function() {
      return inited;
    });
  };

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });
  });

  describe("Fight Handler", function(){

    describe("battle.fightHandler.attack", function(){
      it("should can be return the correct battle log", function(){
        request('battle.fightHandler.attack', {playerId: '10000', targetId: '10001'}, function(data){
          expect(data.code).toEqual(200);
          bl = JSON.parse(data.msg);

          expect(bl.enemy).toEqual(jasmine.any(Object));
          expect(bl.winner).toEqual('enemy');
          expect(bl.steps).toEqual(jasmine.any(Array));
        });
      });
    });

  });

});
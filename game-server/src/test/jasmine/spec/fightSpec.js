describe("Battle Server # ", function() {
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

    it('load test data form csv files', function() {
      doAjax('/loadDataFromCsvFile', {}, function(data) {
        expect(data).toEqual('done');
      });
    });
  });

  describe("Fight Handler", function(){

    describe("battle.fightHandler.attack", function(){
      it("should can be return the correct battle log", function(){
        request('battle.fightHandler.attack', {playerId: '1', targetId: '2'}, function(data){
          expect(data.code).toEqual(200);
          bl = JSON.parse(data.msg);

          //expect(bl).toEqual('')
          console.log(bl);
          expect(bl.enemy).toEqual(jasmine.any(Object));
          expect(bl.winner).toEqual('enemy');
          expect(bl.steps).toEqual(jasmine.any(Array));
          
          expect(_.filter(bl.enemy.cards, function(c) { return c;}).length).toEqual(5);
          expect(_.filter(bl.own.cards, function(c){ return c!==null;}).length).toEqual(5);

          expect(_.filter(bl.steps, function(s){
            return s.death && Math.abs(s.d) < 6;
          }).length).toEqual(5);
          console.log(data);
        });
      });
    });

  });

  // describe("Tear Down", function(){
  //   it('disconnect', function(){
  //     pomelo.disconnect();
  //   });
  // })

});
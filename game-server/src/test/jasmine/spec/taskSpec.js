describe("Logic Server # ", function() {
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

  describe("Task Handler", function(){

    describe("logic.taskHandler.explore", function(){
      // it("add player", function(){
      //   $.get('/addPlayer', {playerId: '5', userId: '1', areaId: '1', name: 'wuzhanghai'}, function(data){
      //     expect(data).toEqual({code: 200});
      //   });
      // });

      it("should can be return the correct battle log", function(){
        request('logic.taskHandler.explore', {playerId: '1'}, function(data){
          //expect(data.code).toEqual(200);
          //bl = JSON.parse(data.msg);

          expect(data).toEqual('')
          console.log(data);
        });
      });
    });

    // describe("logic.taskHandler.passBarrier", function(){
      
    //   it("should can be execute and return result of pass barrier", function(){
    //     request('logic.taskHandler.passBarrier', {playerId: '1'}, function(data){
    //       expect(data).toEqual('')
    //       console.log(data);
    //     });
    //   });
      
    // });

  });

});
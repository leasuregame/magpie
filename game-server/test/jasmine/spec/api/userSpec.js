describe("User Actions # ", function() {
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

  var intiPomelo = function(){
    runs(function(){
      pomelo.init({
        host: '127.0.0.1',
        port: '3010'
      }, function() {
        console.log('connect success!');
        inited = true;

        pomelo.on('onChart', function(data){
          console.log('on chart: ', data);
        })
      });
    });
    waitsFor(function(){return inited;});
  };

  describe("Entry Handler", function(){
    beforeEach(intiPomelo);

    it("entry method should works fine.", function() {
      request('connector.entryHandler.entry', {uid: 1, name: 'wuzhanghai'}, function(data){
        expect(data).toEqual({code: 200, msg: "game server is ok"});
      });
    });
    
  });

  describe('User Handler', function(){

    it("register", function(){
      request('connector.userHandler.register', {uid: 1, email: '175040128@qq.com', password: 1}, function(data){
        // expect(data.code).toEqual(200);
        // expect(data.msg).toEqual(1)
      });
    });

    it("login", function(){
      request('connector.userHandler.login', {email: '175040128@qq.com', password: '1'}, function(data){
        expect(data).toEqual({code: 200, uid: 32209})
      });
    });

    it("setName", function(){
      request('connector.userHandler.setName', {uid: 32209, name: 'wuzhanghai'}, function(data){
        expect(data).toEqual({code: 200})
      });
    })

  });

});
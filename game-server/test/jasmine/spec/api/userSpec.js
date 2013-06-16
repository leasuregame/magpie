describe("User Actions # ", function() {
  var pomelo = window.pomelo;
  var inited = false;
  var userid;

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

  describe("after connected to server", function(){
    it("Set Up", function(){
      intiPomelo();
    });
  });

  describe("Entry Handler", function(){
    it("entry method should works fine.", function() {
      request('connector.entryHandler.entry', {uid: 32209, name: 'wuzhanghai'}, function(data){
        expect(data).toEqual({code: 200, msg: "game server is ok"});
      });
    });
  });

  describe('User Handler', function(){

    describe("when user not exists", function(){
      afterEach(function(){
        console.log('delete user:', userid);
        $.get('/removeuser', {uid: userid}, function(data){
          
        });
      });

      it("register with a valid email and password", function(){
        request('connector.userHandler.register', {email: 'test_email@qq.com', password: '1'}, function(data){
          userid = data.uid
          expect(data.code).toEqual(200);
        });
      });

      it("register with an invalid email", function(){
        request('connector.userHandler.register', {email: '123456', password: '1'}, function(data){
          userid = data.uid
          expect(data.code).toEqual(200);
        });
      });

      it("register with empty email or password", function(){
        request('connector.userHandler.register', {email: '', password: ''}, function(data){
          expect(data.code).toEqual(501);
          expect(data.msg).toEqual('');
        });
      });
    });

    describe("when user exists", function(){
      beforeEach(function(){
        var ok = false;
        runs(function(){
          $.get('/adduser', {email: 'test_email_1@qq.com', password: '1'}, function(data){
            userid = data.uid;
            ok = true;
          });
        });
        
        waitsFor(function(){return ok;});
      });

      afterEach(function(){
        console.log('delete user:', userid);
        var ok = false;
        runs(function(){
          $.get('/removeuser', {uid: userid}, function(data){
            ok = true;
          });
        });

        waitsFor(function(){return ok;});
      });

      it("should can be register with exist email", function(){
        request('connector.userHandler.register', {email: 'test_email_1@qq.com', password: 1}, function(data){
          expect(data.code).toEqual(501);
        });
      });

       it("should can be login", function(){
        request('connector.userHandler.login', {email: 'test_email_1@qq.com', password: '1'}, function(data){
          expect(data.code).toEqual(200)
        });
      });

      it("should can be set name to user", function(){
        request('connector.userHandler.setName', {uid: userid, name: 'wuzhanghai'}, function(data){
          expect(data).toEqual({code: 200})
        });
      });

    });
    
  });

  // describe('Player Handler', function(){
  //   it("createPlayer", function(){
  //     request('connector.playerHandler.createPlayer', {name: 'wuzhanghai'}, function(data){
  //       expect(data).toEqual({code: 200})
  //     });
  //   });
  // });


});
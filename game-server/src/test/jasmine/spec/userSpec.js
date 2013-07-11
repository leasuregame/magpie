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
          console.log('***** on chart: ', data);
        });
        pomelo.on('onLogin', function(data){
          console.log('***** on login: ', data);
        });
      });
    });
    waitsFor(function(){return inited;});
  };

  describe("Set Up", function(){
    it("connect to server", function(){
      intiPomelo();
    });
  });

  describe("Entry Handler", function(){
    it("entry method should works fine.", function() {
      request('connector.entryHandler.entry', {uid: 1}, function(data){
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
        request('connector.userHandler.register', {account: 'test_email@qq.com', password: '1'}, function(data){
          userid = data.uid
          expect(data.code).toEqual(200);
        });
      });

      it("register with an invalid email", function(){
        request('connector.userHandler.register', {account: '123456', password: '1'}, function(data){
          userid = data.uid
          expect(data.code).toEqual(200);
        });
      });

      it("register with empty email or password", function(){
        request('connector.userHandler.register', {account: '', password: ''}, function(data){
          expect(data.code).toEqual(501);
          expect(data.msg).toEqual('参数不正确！');
        });
      });
    });

    describe("when user exists", function(){
      beforeEach(function(){
        var ok = false;
        runs(function(){
          $.get('/adduser', {account: 'test_email_1@qq.com', password: '1'}, function(data){
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

      it("should not can be register with exist email", function(){
        request('connector.userHandler.register', {account: 'test_email_1@qq.com', password: 1}, function(data){
          expect(data.code).toEqual(501);
          //expect(data.msg).toEqual('')
        });
      });

      it("should can be login", function(){
        request('connector.userHandler.login', {account: '1', password: '1'}, function(data){
          expect(data.code).toEqual(200);
          //expect(data.uid).toEqual(userid);
          expect(data.player).toEqual('');
        });
      });

    });
    
  });

});
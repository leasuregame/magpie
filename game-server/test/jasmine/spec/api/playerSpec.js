describe("Connecter Server # ", function() {
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

  describe('Player Handler', function(){
    beforeEach(function(){
      var ok = false;
      runs(function(){
        $.get('/adduser', {account: 'test_email_2@qq.com', password: '1'}, function(data){
          userid = data.uid;
          ok = true;
        });
      });
      
      waitsFor(function(){return ok;});
    });

    afterEach(function(){
      var ok = false;
      runs(function(){
        $.get('/removeuser', {uid: userid}, function(data){
          ok = true;
        });
      });

      waitsFor(function(){return ok;});
    });

    describe("when user login", function(){
      beforeEach(function(){
        request('connector.userHandler.login', {account: 'test_email_2@qq.com', password: '1'}, function(data){
          if (data.code == 200){
            console.log('login success.');
          }
          else{
            console.log('login faild.');
          }
        });

        pomelo.on('onChart', function(data){
          console.log('message: on chart: ', data);
        })
      });

      it("should can be create player", function(){
        request('connector.playerHandler.createPlayer', {name: 'wuzhanghai'}, function(data){
          expect(data).toEqual({ code : 200, player : { id : userid, name : 'wuzhanghai' } })
        });
      });
    });

  });

});
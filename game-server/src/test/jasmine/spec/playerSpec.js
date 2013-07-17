describe("Connecter Server # ", function() {
  var pomelo = window.pomelo;
  var userid;

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
      var pid;

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

      afterEach(function(){
        $.get('/removePlayer', {pid: pid}, function(data){

          })
      });

      it("should can be create player", function(){
        request('connector.playerHandler.createPlayer', {name: 'wuzhanghai', areaId: 1}, function(data){
          console.log(data);
          var player = data.msg.player;
          pid = data.msg.player.id;
          expect(data).toEqual({
            code: 200,
            msg: {
              player: {
                  id: pid,
                  createTime: player.createTime,
                  userId: userid,
                  areaId: 1,
                  name: 'wuzhanghai',
                  power: 100,
                  lv: 1,
                  exp: 0,
                  money: 1000,
                  gold: 50,
                  lineUp: {},
                  ability: 0,
                  task: {
                      id: 1,
                      progress: 0
                  },
                  pass: 0,
                  passMark: 0,
                  dailyGift: [],
                  skillPoint: 0,
                  energy: 0,
                  cards: []
              }
            }
          });
        });
      });
    });

  });

});
describe("Connecter Server # ", function() {
  var pomelo = window.pomelo;
  var userid;

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });

    it("init database", function() {
      doAjax('/createDb', {}, function(data) {
        expect(data).toEqual('done');
      });
    })
  });

  describe('Player Handler', function(){
    beforeEach(function(){
      doAjax('/adduser', {account: 'test_email_2@qq.com', password: '1'}, function(data) {
        userid = data.uid;
      });
    });

    afterEach(function(){
      doAjax('/removeuser', {uid: userid}, function(data) {});
    });

    describe("when user login", function(){
      var pid;
      var myName = 'wuzhanghai';

      beforeEach(function(){
        request('connector.userHandler.login', {account: 'test_email_2@qq.com', password: '1'}, function(data){
          if (data.code == 200){
            console.log('login success.');
          }
          else{
            console.log('login faild.');
          }
        });
      });

      afterEach(function(){
        doAjax('/removePlayer', {playerId: pid}, function(data){});
      });

      it("should can be create player", function(){
        request('connector.playerHandler.createPlayer', {name: myName, areaId: 1}, function(data){
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
                  cards: [], 
                  rank: null
              }
            }
          });
        });
      });
      
      describ("when player exists", function(){
        beforeEach(function(){
          doAjax('/addPlayer', {userId: userid, areaId: 1, name: myName}, function(data){
            pid = data.playerId;
          });
        });

        afterEach(function(){
          doAjax('/removePlayer', {playerId: pid}, function(data){});
        })
        it("should can not create duplicate player", function() {
          request('connector.playerHandler.createPlayer', {name: myName, areaId: 1}, function(data){
            expect(data).toEqual({
              code: 501, 
              msg: "player exists."
            })
          });
        });

      });

      

    });

  });

});
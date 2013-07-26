describe("Connecter Server # ", function() {
  var pomelo = window.pomelo;
  var userid;
  var pid;
  var myName = 'wuzhanghai';
  
  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });

    it("init database", function() {
      doAjax('/createDb', {}, function(data) {});
    })
  });

  describe('Player Handler', function(){
    
    it("add user test_email_2@qq.com",function(){
      doAjax('/adduser', {account: 'test_email_2@qq.com', password: '1'}, function(data) {
        userid = data.uid;
      });
    });
      
    it ("login with test_email_2@qq.com", function(){
      request('connector.userHandler.login', {account: 'test_email_2@qq.com', password: '1'}, function(data){
        if (data.code == 200){
          console.log('login success.');
        }
        else{
          console.log('login faild.');
        }
      });
    });

    it("should can be create player", function(){
      request('connector.playerHandler.createPlayer', {name: myName, areaId: 1}, function(data){
        console.log('create new palyer');
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
                pass: { layer : 0, mark : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] },
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

    it("should can not create duplicate player", function() {
      request('connector.playerHandler.createPlayer', {name: myName, areaId: 1}, function(data){
        console.log('create dup player');
        expect(data).toEqual({
          code: 501, 
          msg: "player exists."
        })
      });
    });

  });

  describe("tearm donw", function(){
    it("remove user", function(){
      doAjax('/removeuser', {uid: userid}, function(data) {});
    });

    it("remove player", function(){
      doAjax('/removePlayer', {playerId: pid}, function(data){});
    });
  });    

});
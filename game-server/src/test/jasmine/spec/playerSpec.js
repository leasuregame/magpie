describe("Connector Server", function() {
  var userid;
  var pid;
  var myName = 'wuzhanghai';

  beforeAll(function() {
    doAjax('/createDb', {}, function(data) {});
  })

  describe('Player Handler', function() {

    beforeEach(function() {
      doAjax('/adduser', {
        account: 'test_email_2@qq.com',
        password: '1'
      }, function(data) {
        userid = data.uid;
      });

      request('connector.userHandler.login', {
        account: 'test_email_2@qq.com',
        password: '1',
        areaId: 1
      }, function(data) {
        if (data.code == 200) {
          console.log('login success.', data);
        } else {
          console.log('login faild.', data);
        }
      });
    });

    afterEach(function() {
      doAjax('/removeuser', {
        uid: userid
      }, function(data) {});
      doAjax('/removePlayer', {
        playerId: pid
      }, function(data) {});
    });

    describe("when player not exists", function() {
      it("should can be create player", function() {
        request('connector.playerHandler.createPlayer', {
          name: myName,
          areaId: 1
        }, function(data) {
          console.log('create new palyer');
          console.log(data);
          var player = data.msg.player;
          pid = data.msg.player.id;

          var cards = data.msg.player.cards;
          delete data.msg.player.cards;
          expect(cards.length).toEqual(3);

          expect(data).toEqual({
            code: 200,
            msg: {
              player: {
                id: pid,
                createTime: player.createTime,
                userId: userid,
                areaId: 1,
                name: 'wuzhanghai',
                power: {
                  time: 0,
                  value: 50
                },
                lv: 1,
                exp: 0,
                money: 1000,
                gold: 50,
                lineUp: {
                  6: -1
                },
                ability: 0,
                task: {
                  id: 1,
                  progress: 0,
                  hasWin: false
                },
                pass: {
                  layer: 0,
                  mark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                dailyGift: [],
                skillPoint: 0,
                energy: 0,
                elixir: 0,
                spiritor: {
                  lv: 0,
                  spirit: 0
                },
                spiritPool: {
                  lv: 0,
                  exp: 0,
                  collectCount: 0
                },
                rank: null
              }
            }
          });
        });
      });

    });

    describe("when player exists", function() {
      var pid1;

      beforeEach(function() {
        doAjax('/addPlayer', {
          userId: userid,
          name: myName,
          areaId: 1
        }, function(data) {
          pid1 = data.playerId;
        });
      });

      afterEach(function() {
        doAjax('removePlayer', {
          playerId: pid1
        }, function() {});
      })

      it("should can not create duplicate player", function() {
        request('connector.playerHandler.createPlayer', {
          name: myName,
          areaId: 1
        }, function(data) {
          console.log('create dup player');
          expect(data).toEqual({
            code: 501,
            msg: "player exists."
          })
        });
      });

    });

  });

});
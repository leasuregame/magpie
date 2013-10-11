describe("Connector Server", function() {
  var userid;
  var pid;
  var myName = 'wuzhanghai';

  beforeAll(function() {
    doAjax('/loaddata/csv', {}, function(data) {});
  })

  describe('Player Handler', function() {
    var arthur = {
      id: 100,
      playerId: 100,
      areaId: 1,
      account: 'arthur',
      password: '1'
    };

    var papa = {
      id: 103,
      playerId: 103,
      areaId: 1,
      account: 'papa',
      password: '1'
    };
    beforeEach(function() {
      loginWith(arthur.account, arthur.password, arthur.areaId);
    });

    describe("when player not exists", function() {
      it("should can be create player", function() {
        request('connector.playerHandler.createPlayer', {
          name: myName,
          areaId: 1
        }, function(data) {
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
                userId: 100,
                areaId: 1,
                name: 'wuzhanghai',
                power: {
                  time: 0,
                  value: 50
                },
                lv: 1,
                vip: 0,
                vipBox: [],
                cash: 0,
                exp: 0,
                money: 0,
                gold: 0,
                lineUp: {
                  6: -1
                },
                ability: 0,
                task: {
                  id: 1,
                  progress: 0,
                  hasWin: false,
                  mark: []
                  // momo: []
                },
                pass: {
                  canReset: true,
                  layer: 0,
                  mark: [],
                  hasMystical: false
                },
                dailyGift: {
                  lotteryCount: 500,
                  lotteryFreeCount: 0,
                  powerGiven: [],
                  powerBuyCount: 2,
                  challengeCount: 15,
                  receivedBless: {
                    count: 15,
                    givers: []
                  },
                  gaveBless: {
                    count: 15,
                    receivers: []
                  }
                },
                skillPoint: 0,
                energy: 0,
                elixir: 0,
                spiritor: {
                  lv: 0,
                  spirit: 0
                },
                spiritPool: {
                  lv: 1,
                  exp: 0,
                  collectCount: 15
                },
                rank: {},
                friends: [],
                signIn: {
                  months: {},
                  flag: 0
                }
              }
            }
          });
        });
      });

    });

    describe("when player exists", function() {

      it("should can not create duplicate player", function() {
        request('connector.playerHandler.createPlayer', {
          name: 'arthur',
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
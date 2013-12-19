describe("Connector Server", function() {
  var userid;
  var pid;
  var myName = '大海无量';

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

    describe("when player not exists", function() {
      beforeEach(function() {
        loginWith('newAccount', '1', 1);
      });

      it("should can be create player", function() {
        request('connector.playerHandler.createPlayer', {
          name: myName,
          areaId: 1
        }, function(data) {
          console.log(data);
          var player = data.msg.player;
          pid = data.msg.player.id;

          var cards = data.msg.player.cards;
          expect(cards.length).toEqual(0);
          delete data.msg.player.uniqueId;
          delete data.msg.player.createTime;

          expect(data).toEqual({
            code: 200,
            msg: {
              player: {
                id: 116,
                userId: 5,
                areaId: 1,
                name: '大海无量',
                power: {
                  time: 0,
                  value: 500
                },
                lv: 1,
                vip: 0,
                vipBox: [],
                cash: 0,
                exp: 0,
                money: 10000,
                gold: 20,
                lineUp: {
                  6: -1
                },
                ability: 300,
                task: {
                  id: 1,
                  progress: 0,
                  mark: []
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
                  powerBuyCount: 3,
                  challengeCount: 10,
                  challengeBuyCount: 10,
                  receivedBless: {
                    count: 5,
                    givers: []
                  },
                  gaveBless: {
                    count: 5,
                    receivers: []
                  }
                },
                skillPoint: 0,
                energy: 0,
                fragments: 0,
                elixir: 0,
                spiritor: {
                  lv: 1,
                  spirit: 890,
                  ability: 300
                },
                spiritPool: {
                  lv: 1,
                  exp: 0,
                  collectCount: 15
                },
                cards: [],
                rank: {
                  ranking: 0
                },
                signIn: {},
                firstTime: {
                  lowLuckyCard: 1,
                  highLuckyCard: 1
                },
                teachingStep: 0,
                cardsCount: 35
              }
            }
          });
        });
      });

    });

    describe("when player exists", function() {
      beforeEach(function() {
        loginWith(arthur.account, arthur.password, arthur.areaId);
      });

      it("should can not create duplicate player", function() {
        request('connector.playerHandler.createPlayer', {
          name: 'arthur',
          areaId: 1
        }, function(data) {
          console.log('create dup player');
          expect(data).toEqual({
            code: 501,
            msg: "该玩家已存在"
          })
        });
      });

    });

  });

});
describe("Area Server", function() {
  describe('Message Handler', function() {
    describe('area.messageHandler.giveBless', function() {
      var arthur = {
        id: 100,
        playerId: 100,
        areaId: 1,
        account: 'arthur',
        password: '1'
      };

      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('when a player is my friend', function() {
        beforeEach(function() {
          loginWith(arthur.account, arthur.password, arthur.areaId);
        });

        it('should can give bless to him', function() {
          request('area.messageHandler.giveBless', {
            friendId: 1
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                energy: 5
              }
            });
          });
        });
      });

      describe('when there is no give bless count', function() {
        var now = new Date();
        beforeEach(function() {
          doAjax('/update/player/100', {
            dailyGift: JSON.stringify({
              lotteryCount: 500,
              lotteryFreeCount: 15,
              powerGiven: [],
              powerBuyCount: 5,
              challengeCount: 10,
              challengeBuyCount: 10,
              expCardCount: 10,
              receivedBless: {
                count: 5,
                givers: []
              },
              gaveBless: {
                count: 0,
                receivers: []
              }
            }),
            resetDate: '' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
          }, function(err, res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('should can not give a bless', function() {
          request('area.messageHandler.giveBless', {
            friendId: 1
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '今日你送出祝福的次数已经达到上限'
            });
          });
        });
      });

      describe('when there is not receive count for a friend', function() {
        var now = new Date();
        beforeEach(function() {
          doAjax('/update/player/1', {
            dailyGift: JSON.stringify({
              lotteryCount: 500,
              lotteryFreeCount: 15,
              powerGiven: [],
              powerBuyCount: 5,
              challengeCount: 10,
              challengeBuyCount: 10,
              expCardCount: 10,
              receivedBless: {
                count: 0,
                givers: []
              },
              gaveBless: {
                count: 5,
                receivers: []
              }
            }),
            resetDate: '' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
          }, function(err, res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('should can not give a bless', function() {
          request('area.messageHandler.giveBless', {
            friendId: 1
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '今日你送出祝福的次数已经达到上限'
            });
          });
        });
      });

      describe('when a player is self', function() {
        beforeEach(function() {
          loginWith(arthur.account, arthur.password, arthur.areaId);
        });

        it('should can not give bless to him', function() {
          request('area.messageHandler.giveBless', {
            friendId: 100
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '不能给自己送祝福'
            });
          });
        });
      });


      describe('when receive bless from a friend', function() {
        describe('when the message is not mine', function() {
          beforeEach(function() {
            loginWith(arthur.account, arthur.password, arthur.areaId);
          });

          it('should can not handler the messages that not sended to me', function() {
            request('area.messageHandler.receiveBless', {
              msgId: 1
            }, function(data) {
              expect(data).toEqual({
                code: 501,
                msg: '你没有权限处理此消息'
              });
            });
          });
        });

        describe('when the message is mine', function() {
          var now = new Date();
          beforeEach(function() {
            doAjax('/update/player/1', {
              dailyGift: JSON.stringify({
                lotteryCount: 500,
                lotteryFreeCount: 15,
                powerGiven: [],
                powerBuyCount: 5,
                challengeCount: 10,
                challengeBuyCount: 10,
                expCardCount: 10,
                receivedBless: {
                  count: 5,
                  givers: []
                },
                gaveBless: {
                  count: 5,
                  receivers: []
                }
              }),
              resetDate: '' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
            }, function(err, res) {
              loginWith('1', '1', 1);
            });
          });

          it('should can receive bless', function() {
            request('area.messageHandler.receiveBless', {
              msgId: 1
            }, function(data) {
              expect(data).toEqual({
                code: 200,
                msg: {
                  energy: 5
                }
              });
            });
          });
        });

      });


    });
  });
});
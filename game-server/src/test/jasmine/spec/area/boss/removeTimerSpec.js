describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.removeTimer", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('消除Boss攻击等待时间', function() {

        beforeEach(function() {
          doAjax('/update/player/100', {
            gold: 1100,
            cd: {
              lastAtkTime: new Date().getTime()
            }
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('连续消除两次', function() {

          request('area.bossHandler.removeTimer', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                gold: 1080
              }
            });
          });

          doAjax('/player/100', function(res) {
            expect(res.data.gold).toEqual(1080);
          });

          request('area.bossHandler.removeTimer', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '没有可消除的CD'
            });
          });

        });

      });

      describe('魔石不足', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            gold: 10,
            cd: {
              lastAtkTime: new Date().getTime()
            }
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能消除CD', function() {
          request('area.bossHandler.removeTimer', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '魔石不足'
            });
          });
        });

      });

      var totalGold = 500;

      var doRemoveCD = function(i) {
        describe('第' + i + '次消除CD', function() {
          beforeEach(function() {
            doAjax('/update/player/100', {
              gold: 20 * i > 200 ? 200 : 20 * i,
              dailyGift: {
                rmTimerCount: i
              },
              cd: {
                lastAtkTime: new Date().getTime()
              },
              resetDate: shortDateString()
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('执行正确，并扣除相应的魔石', function() {

            request('area.bossHandler.removeTimer', {}, function(data) {
              expect(data).toEqual({
                code: 200,
                msg: {
                  gold: 0
                }
              });

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(0);
              })
            });

          });
        });
      };

      describe('消除CD', function() {
        doRemoveCD(1);
      });
      describe('消除CD', function() {
        doRemoveCD(2);
      });
      describe('消除CD', function() {
        doRemoveCD(3);
      });
      describe('消除CD', function() {
        doRemoveCD(6);
      });
      describe('消除CD', function() {
        doRemoveCD(30);
      });

    });
  });
});
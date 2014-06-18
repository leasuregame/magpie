describe("Area Server", function() {
  describe("Exp Pass Handler", function() {
    describe("area.expPassHandler.attack", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe("当玩家可以攻打经验副本时", function() {
        describe('攻击成功', function() {
          var before_player;

          beforeEach(function() {
            doAjax('/update/player/100', {
              power: {
                time: new Date().getTime(),
                value: 50
              }
            }, function() {
              doAjax('/player/100', function(res) {
                before_player = res.data;
                loginWith('arthur', '1', 1);
              });
            });
          });

          it("返回正确的结果，并得到正确经验卡奖励", function() {
            request('area.expPassHandler.attack', {
              id: 3
            }, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              result = data.msg;

              expect(result.isUpgrade).toEqual(false);
              expect(result.level9Box).toEqual(null);
              expect(result.upgradeInfo).toEqual(null);
              expect(result.exp).toEqual(1100);

              //expect(result.battleLog).toBeBattleLog();

              cards = result.battleLog.rewards.cards;
              expect(cards.length >= 9 && cards.length <= 11).toEqual(true);
              var tids = cards.map(function(c) {
                return c.tableId
              });
              expect(_.difference(_.uniq(tids), [50001, 50002, 50003, 50004, 50005])).toEqual([]);

              doAjax('/player/100', function(res) {
                expect(res.data.exp).toEqual(before_player.exp + 100);
                expect(JSON.parse(res.data.power).value).toEqual(JSON.parse(before_player.power).value - 10);
                expect(JSON.parse(res.data.dailyGift).expPassFreeCount).toEqual(4);
              });

            });

          });
        });

        describe('攻击失败', function() {

          beforeEach(function() {
            doAjax('/update/player/2', {
              power: {
                time: new Date().getTime(),
                value: 50
              }
            }, function() {
              doAjax('/player/2', function(res) {
                before_player = res.data;
                loginWith('2', '1', 1);
              });

            });


          });

          it("返回正确的结果，并得到正确经验卡奖励", function() {
            request('area.expPassHandler.attack', {
              id: 3
            }, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              result = data.msg;

              expect(result.isUpgrade).toEqual(false);
              expect(result.level9Box).toEqual(null);
              expect(result.upgradeInfo).toEqual(null);
              expect(result.exp).toEqual(400);

              //expect(result.battleLog).toBeBattleLog();

              cards = result.battleLog.rewards.cards;
              expect(cards).toEqual(null);

              doAjax('/player/2', function(res) {
                expect(res.data.exp).toEqual(before_player.exp);
                expect(JSON.parse(res.data.power).value).toEqual(JSON.parse(before_player.power).value - 1);
                expect(JSON.parse(res.data.dailyGift).expPassFreeCount).toEqual(5);
              });
            });

          });
        });


      });

      describe('当等级不够时', function() {
        beforeEach(function() {
          doAjax('/update/player/2', {
            lv: 10
          }, function(res) {
            loginWith('2', '1', 1);
          });
        });

        it('不能攻击经验副本', function() {
          request('area.expPassHandler.attack', {
            id: 1
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '15级开放'
            })
          });
        });

      });

      describe('当玩家升级时', function() {
        var before_player;
        beforeEach(function() {
          doAjax('/update/player/101', {
            lv: 15,
            exp: 170,
            power: {
              time: new Date().getTime(),
              value: 50
            }
          }, function() {
            doAjax('/player/101', function(res) {
              before_player = res.data;
              loginWith('user4', '1', 1);
            });
          });
        });

        it("返回正确的结果，并得到正确经验卡奖励", function() {
          request('area.expPassHandler.attack', {
            id: 1
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(200);
            result = data.msg;

            expect(result.isUpgrade).toEqual(true);
            expect(result.level9Box).toEqual(null);
            expect(result.upgradeInfo).toEqual({
              friendsCount: 20,
              lv: 16,
              rewards: {
                elixir: 1100,
                energy: 0,
                money: 17000,
                power: 20,
                skillPoint: 0
              }
            });
            expect(result.exp).toEqual(17);

            //expect(result.battleLog).toBeBattleLog();

            cards = result.battleLog.rewards.cards;
            expect(cards.length >= 9 && cards.length <= 11).toEqual(true);
            var tids = cards.map(function(c) {
              return c.tableId
            });
            expect(_.difference(_.uniq(tids), [50001, 50002, 50003])).toEqual([]);

            doAjax('/player/101', function(res) {
              expect(res.data.exp).toEqual(17);
              expect(JSON.parse(res.data.power).value).toEqual(JSON.parse(before_player.power).value - 10 + 20);
              expect(JSON.parse(res.data.dailyGift).expPassFreeCount).toEqual(4);
            });
          });

        });
      });

      describe('当玩家升级到9级时，获得9级礼包', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 8,
            exp: 80,
            power: {
              time: new Date().getTime(),
              value: 20
            }
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能攻击经验副本', function() {
          request('area.expPassHandler.attack', {
            id: 1
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '15级开放'
            })
          });
        });
      });

      describe('当体力不足时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 40,
            power: {
              time: new Date().getTime(),
              value: 5
            }
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能攻击经验副本', function() {
          request('area.expPassHandler.attack', {
            id: 1
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '体力不足'
            })
          });
        });
      });

      describe('免费次数用完时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 40,
            power: {
              time: new Date().getTime(),
              value: 100
            },
            dailyGift: {
              expPassFreeCount: 0
            }
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能攻击经验副本', function() {
          request('area.expPassHandler.attack', {
            id: 1
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '今日免费次数已用完'
            });
          });
        });
      });

      describe('当参数不正确时', function() {
        beforeEach(function() {
          loginWith('1', '1', 1);
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: 0
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: 4
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: 'a'
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: {}
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

      });

    });
  });
});
describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.attack", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('我的boss', function() {
        var bossId;
        var bossCreateTime = new Date().getTime();

        describe('沉睡的Boss', function() {
          var before_player;

          beforeEach(function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 0,
              hp: '{"2":{"cardId":40001,"hp":80000000},"4":{"cardId":40004,"hp":100000},"6":{"cardId":40004,"hp":100000}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              hp_left = 0
              _.each(data.msg.battleLog.cards, function(v, k) {
                if (parseInt(k) > 6) {
                  hp_left += v.hp_left;
                }
              });

              expect(data.msg.damage).toEqual(80200000 - hp_left);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });
            })
          });
        });

      });

      describe('好友的boss', function() {
        var bossId;
        var bossCreateTime = new Date().getTime();

        describe('苏醒的Boss', function() {
          var before_player;

          beforeEach(function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              hp_left = 0
              _.each(data.msg.battleLog.cards, function(v, k) {
                if (parseInt(k) > 6) {
                  hp_left += v.hp_left;
                }
              });

              expect(data.msg.damage).toEqual(79940219 + 60825 - hp_left);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(data.msg.gold).toEqual(before_player.gold - 120);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });
            })
          });
        });

      });

    });
  });
});
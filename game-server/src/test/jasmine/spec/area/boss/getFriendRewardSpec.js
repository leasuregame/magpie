describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.getFriendReward", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      // afterEach(function() {
      //   doAjax('/clear/boss', function() {});
      //   doAjax('/clear/bossAttack', function() {});
      //   doAjax('/clear/damageOfRank', function() {});
      //   doAjax('/clear/bossFriendReward', function() {});
      // });

      describe('当没有奖励可领时', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能领取', function() {
          request('area.bossHandler.getFriendReward', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '没有奖励可领'
            });
          });
        });

      });

      describe('当有好友奖励可领时', function() {
        var bossId;
        var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

        beforeEach(function() {

          doAjax('/create/boss', {
            playerId: 1,
            tableId: 2,
            atkCount: 1,
            status: 2,
            hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
            createTime: bossCreateTime
          }, function(res) {
            bossId = res.insertId;

            doAjax('/update/player/100', {
              cd: {
                lastAtkTime: 0
              }
            }, function() {
              loginWith('arthur', '1', 1);
            });

          });

        });

        it('可以领取', function() {

          request('area.bossHandler.attack', {
            bossId: bossId
          }, function(adata) {
            console.log(adata);

            pomelo.disconnect();
            initPomelo();

            loginWith('1', '1', 1);

            request('area.bossHandler.getFriendReward', {}, function(data) {
              console.log(data);
              expect(data.msg.money).toBeGreaterThan(1);
              expect(data.msg.honor).toBeGreaterThan(1);
            });

            request('area.bossHandler.getFriendReward', {}, function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 501,
                msg: '没有奖励可领'
              });
            });

          });



        });

      });

    });
  });
});
describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.getLastWeekReward", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      afterEach(function() {
        doAjax('/clear/boss', function() {});
        doAjax('/clear/bossAttack', function() {});
        doAjax('/clear/damageOfRank', function() {});
        doAjax('/clear/bossFriendReward', function() {});
      });

      describe('当上周没有奖励可领时', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能领取额', function() {
          request('area.bossHandler.getLastWeekReward', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '上周不够努力，没奖励可领哦'
            });
          });
        });
      });


      describe('当上周有奖励可领时', function() {
        beforeEach(function() {

          doAjax('/create/damageOfRank', {
            playerId: 2,
            week: lastWeek(),
            damage: 1000000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 1,
            week: lastWeek(),
            damage: 900000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 100,
            week: lastWeek(),
            damage: 800000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 3,
            week: lastWeek(),
            damage: 700000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 4,
            week: lastWeek(),
            damage: 600000
          }, function() {});

          loginWith('arthur', '1', 1);

        });

        it('排名第3名的奖励', function() {
          request('area.bossHandler.getLastWeekReward', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 200,
              msg: {
                honor: 10000,
                money: 300000,
                energy: 6000
              }
            });
          });
<<<<<<< HEAD
        });
      });
=======

          request('area.bossHandler.getLastWeekReward', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '不能重复领取'
            });
          });
          
        });
      });

      describe('当上周有奖励可领时', function() {
        beforeEach(function() {

          doAjax('/create/damageOfRank', {
            playerId: 2,
            week: lastWeek(),
            damage: 1000000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 5,
            week: lastWeek(),
            damage: 900000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 100,
            week: lastWeek(),
            damage: 800000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 3,
            week: lastWeek(),
            damage: 700000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 4,
            week: lastWeek(),
            damage: 600000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 1,
            week: lastWeek(),
            damage: 500000
          }, function() {});

          loginWith('1', '1', 1);

        });

        it('排名第6名的奖励', function() {
          request('area.bossHandler.getLastWeekReward', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 200,
              msg: {
                honor: 7976
              }
            });
          });

          request('area.bossHandler.getLastWeekReward', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '不能重复领取'
            });
          });

        });
      });

>>>>>>> 3795ba5f5d51dc42b536c333cf7ff8c66e7a23b4
    });

  });
});
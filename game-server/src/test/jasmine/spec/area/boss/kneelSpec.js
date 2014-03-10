describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.kneel", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('参数不正确，膜拜对象不存在，玩家没上榜', function() {

        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能膜拜', function() {
          request('area.bossHandler.kneel', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '请指定膜拜对象'
            });
          });

          request('area.bossHandler.kneel', {
            playerId: 1000000
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '膜拜对象不存在'
            });
          });

          request('area.bossHandler.kneel', {
            playerId: 2
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '玩家没有上榜，不能膜拜'
            });
          });

        });

      });

      describe('膜拜次数已用完', function() {
        beforeEach(function() {
          doAjax('/create/damageOfRank', {
            playerId: 3,
            damage: 10000,
            week: thisWeek()
          }, function() {});

          doAjax('/update/player/100', {
            dailyGift: {
              kneelCountLeft: 0
            }
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能膜拜', function() {
          request('area.bossHandler.kneel', {
            playerId: 3
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '膜拜次数已用完'
            });
          });
        });
      });

      describe('膜拜上榜玩家', function() {
        var before_player;

        beforeEach(function() {

          doAjax('/create/damageOfRank', {
            playerId: 4,
            damage: 10000,
            week: thisWeek()
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 100,
            damage: 1000,
            week: thisWeek()
          }, function() {});

          doAjax('/update/player/100', {
            dailyGift: {
              kneelCountLeft: 3
            }
          }, function(res) {

          });

          doAjax('/player/100', function(res) {
            before_player = res.data;
            loginWith('arthur', '1', 1);
          });

        });

        it('可以膜拜，并返回正确结果', function() {
          request('area.bossHandler.kneel', {
            playerId: 4
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                energy: 75,
                power: 15
              }
            });

            doAjax('/player/100', function(res) {
              expect(res.data.energy).toEqual(before_player.energy + data.msg.energy);
              expect(JSON.parse(res.data.power).value).toEqual(JSON.parse(before_player.power).value + data.msg.power);
              expect(JSON.parse(res.data.dailyGift).kneelCountLeft).toEqual(2);
              expect(JSON.parse(res.data.dailyGift).kneelList).toEqual([4]);
            });

            doAjax('/damageOfRank/query', {
              playerId: 4,
              week: thisWeek()
            }, function(res) {
              console.log(res);
              expect(res.data.kneelCount).toEqual(1);
            });

          });

          request('area.bossHandler.kneel', {
            playerId: 4
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '不能重复膜拜'
            });
          });

          request('area.bossHandler.kneel', {
            playerId: 100
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                energy: 75,
                power: 15
              }
            });

            doAjax('/player/100', function(res) {
              // expect(res.data.energy).toEqual(before_player.energy + data.msg.energy);
              // expect(JSON.parse(res.data.power).value).toEqual(JSON.parse(before_player.power).value + data.msg.power);
              expect(JSON.parse(res.data.dailyGift).kneelCountLeft).toEqual(1);
              expect(JSON.parse(res.data.dailyGift).kneelList).toEqual([4, 100]);
            });

          });

        });

      });

    });
  });
});
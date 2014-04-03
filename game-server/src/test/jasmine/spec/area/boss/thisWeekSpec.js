describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.thisWeek", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('本周没有排行榜时', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('返回空列表', function() {
          request('area.bossHandler.thisWeek', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 200,
              msg: {
                damageList: [],
                thisWeek: null
              }
            });
          });
        });

      });

      describe('本周有排行榜时', function() {

        beforeEach(function() {
          doAjax('/create/damageOfRank', {
            playerId: 100,
            week: thisWeek(),
            damage: 850000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 1,
            week: thisWeek(),
            damage: 900000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 2,
            week: thisWeek(),
            damage: 800000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 3,
            week: thisWeek(),
            damage: 700000
          }, function() {});

          doAjax('/create/damageOfRank', {
            playerId: 4,
            week: thisWeek(),
            damage: 600000
          }, function() {});

          loginWith('arthur', '1', 1);
        });

        it('返回正确的列表', function() {
          request('area.bossHandler.thisWeek', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 200,
              msg: {
                damageList: [{
                  playerId: 1,
                  name: null,
                  damage: 900000,
                  kneelCount: 0
                }, {
                  playerId: 100,
                  name: null,
                  damage: 850000,
                  kneelCount: 0
                }, {
                  playerId: 2,
                  name: null,
                  damage: 800000,
                  kneelCount: 0
                }, {
                  playerId: 3,
                  name: null,
                  damage: 700000,
                  kneelCount: 0
                }, {
                  playerId: 4,
                  name: null,
                  damage: 600000,
                  kneelCount: 0
                }],
                thisWeek: {
                  rank: 2,
                  damage: 850000
                }
              }
            });
          });
        })

      });

    });
  });
});
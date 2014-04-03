describe("Area Server", function() {

  describe("Rank Handler", function() {

    describe("area.rankHandler.getElixirRankReward", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });

      describe('当上周没有排名奖励时', function() {

        beforeEach(function() {
          loginWith('2', '1', 1);
        });

        it('不能领取', function() {
          request('area.rankHandler.getElixirRankReward', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '上周不够努力，没奖励可领哦'
            });
          });
        });

      });

      describe('当上周奖励已领取时', function() {

        beforeEach(function() {
          loginWith('1', '1', 1);
        });

        it('不能重复领取', function() {
          request('area.rankHandler.getElixirRankReward', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                money: 506500,
                energy: 7450,
                elixir: 40960,
                power: 115,
                cardIds: []
              }
            });
          });

          request('area.rankHandler.getElixirRankReward', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '不能重复领取'
            });
          });

        });

      });

      describe('当上周奖励还没领取时', function() {
        var before_player;

        beforeEach(function() {
          doAjax('/update/player/100', {
            power: JSON.stringify({
              time: new Date().getTime(),
              value: 0
            })
          }, function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
              loginWith('arthur', '1', 1);
            });
          });
        });

        it('可以领取', function() {
          request('area.rankHandler.getElixirRankReward', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                money: 523000,
                energy: 7900,
                elixir: 44320,
                power: 130,
                cardIds: []
              }
            });

            doAjax('/player/100', function(res) {

              expect(res.data.money).toEqual(before_player.money + data.msg.money);
              expect(res.data.energy).toEqual(before_player.energy + data.msg.energy);
              expect(res.data.elixir).toEqual(before_player.elixir + data.msg.elixir);
              expect(JSON.parse(res.data.power).value).toEqual(JSON.parse(before_player.power).value + data.msg.power);

            });

          });
        });

      });


    });
  });
});
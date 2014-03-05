describe("Area Server", function() {

  describe("Rank Handler", function() {

    describe("area.rankHandler.lastWeek", function() {
      var elist =  [ { playerId : 115, name : 'for cardBook', elixir : 23249 }, { playerId : 114, name : 'buyChallengeCount', elixir : 23248 }, { playerId : 113, name : 'buyPower', elixir : 23247 }, { playerId : 112, name : 'buyMoney', elixir : 23246 }, { playerId : 111, name : '没钱的VIP', elixir : 23245 }, { playerId : 110, name : 'Passer', elixir : 23244 }, { playerId : 108, name : 'user5', elixir : 23243 }, { playerId : 107, name : 'user1', elixir : 23242 }, { playerId : 106, name : '没钱的家伙', elixir : 23241 }, { playerId : 105, name : 'user2', elixir : 23240 }, { playerId : 104, name : 'user3', elixir : 23239 }, { playerId : 103, name : 'player for pass wipeOut', elixir : 23238 }, { playerId : 102, name : 'Player power is not enough', elixir : 23237 }, { playerId : 101, name : 'Defender', elixir : 23236 }, { playerId : 100, name : 'Attacker', elixir : 23235 }, { playerId : 4, name : 'Arthur', elixir : 23234 }, { playerId : 3, name : 'Marhon', elixir : 23233 }, { playerId : 1, name : 'Linc', elixir : 23232 } ];

      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });


      describe('当玩家上周没有竞技仙丹排名时', function() {

        beforeEach(function() {
          loginWith('2', '1', 1);
        });

        it('数据应该正确', function() {
          request('area.rankHandler.lastWeek', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                elixirs: elist,
                lastWeek: null,
                isGet: false
              }
            });
          });
        });

      });

      describe('当玩家上周有竞技仙丹排名时', function() {

        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('数据应该正确', function() {
          request('area.rankHandler.lastWeek', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                elixirs: elist,
                lastWeek: {
                  rank : 15, elixir : 23235
                },
                isGet: false
              }
            });
          });
        });
      });

      describe('当玩家排名奖励可领且已经领取时', function() {
        beforeEach(function() {
          loginWith('user4', '1', 1);
        });

        it('数据应该正确', function() {
          request('area.rankHandler.getElixirRankReward', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                money : 528500, energy : 8050, elixir : 45440, power : 135, cardIds : [ ] 
              }
            });
          });

          request('area.rankHandler.lastWeek', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                elixirs: elist,
                lastWeek: {
                   rank : 14, elixir : 23236 
                },
                isGet: true
              }
            });
          });
        });
      });

    });
  });
});
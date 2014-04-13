describe("Area Server", function() {

  describe("Rank Handler", function() {

    describe("area.rankHandler.thisWeek", function() {

      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });

      var elist = [ { playerId : 115, name : 'for cardBook', elixir : 30018 }, { playerId : 114, name : 'buyChallengeCount', elixir : 30017 }, { playerId : 113, name : 'buyPower', elixir : 30016 }, { playerId : 112, name : 'buyMoney', elixir : 30015 }, { playerId : 111, name : '没钱的VIP', elixir : 30014 }, { playerId : 110, name : 'Passer', elixir : 30013 }, { playerId : 108, name : 'user5', elixir : 30012 }, { playerId : 107, name : 'user1', elixir : 30011 }, { playerId : 106, name : '没钱的家伙', elixir : 30010 }, { playerId : 105, name : 'user2', elixir : 30009 }, { playerId : 104, name : 'user3', elixir : 30008 }, { playerId : 103, name : 'player for pass wipeOut', elixir : 30007 }, { playerId : 102, name : 'Player power is not enough', elixir : 30006 }, { playerId : 101, name : 'Defender', elixir : 30005 }, { playerId : 100, name : 'Attacker', elixir : 30004 }, { playerId : 3, name : 'Marhon', elixir : 30002 }, { playerId : 2, name : 'Mike', elixir : 30001 }, { playerId : 1, name : 'Linc', elixir : 30000 } ];

      describe('当获取本周竞技仙丹排名', function() {
        beforeEach(function() {
          loginWith('1', '1', 1);
        });

        it('列表正确', function() {
          request('area.rankHandler.thisWeek', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                elixirs: elist,
                thisWeek: {
                  rank: 18,
                  elixir: 30000
                }
              }
            })
          });
        });
      });

      describe('当获取本周竞技仙丹排名，自己没有参加过竞技', function() {
        beforeEach(function() {
          loginWith('4', '1', 1);
        });

        it('列表正确', function() {
          request('area.rankHandler.thisWeek', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                elixirs: elist,
                thisWeek: null
              }
            });
          });
        });
      });

    });
  });
});
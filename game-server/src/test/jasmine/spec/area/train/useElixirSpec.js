describe("Area Server", function() {

  describe("Train Handler", function() {
    var poorman = {
      account: 'poorman',
      password: '1',
      areaId: 1,
      id: 106,
      playerId: 106
    };

    var arthur = {
      account: 'arthur',
      password: '1',
      areaId: 1,
      id: 100,
      playerId: 100
    };

    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe('area.trainHandler.useElixir', function() {

      describe('when elixir is not enought', function() {
        beforeEach(function() {
          loginWith(poorman.account, poorman.password, poorman.areaId);
        });

        it('should can not use elixir', function() {
          request('area.trainHandler.useElixir', {
            elixir: 1000,
            cardId: 100
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '仙丹不足'
            });
          });
        });
        
      });

      describe('when do userElixir', function() {
        var before_card, before_player;

        beforeEach(function() {
          loginWith(arthur.account, arthur.password, arthur.areaId);

          doAjax('/player/' + arthur.playerId, function(res) {
            before_player = res.data;
          });

          doAjax('/card/' + 100, function(res) {
            before_card = res.data;
          });
        });

        it('should can be used elixir', function(){
          request('area.trainHandler.useElixir', {
            elixir: 500,
            cardId: 100
          }, function(data) {
            expect(data).toEqual({
              code: 200
            });
          });

          doAjax('/player/' + arthur.playerId, function(res) {
            expect(res.data.elixir).toEqual(before_player.elixir - 500);
          });

          doAjax('/card/' + 100, function(res) {
            expect(res.data.elixir).toEqual(before_card.elixir + 500);
          });

        });

        it("can not find the taget card", function(){
          request('area.trainHandler.useElixir', {
            elixir: 500,
            cardId: -1
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '找不到卡牌'
            });
          });
        });

        it('can not use elixir on card whose star is less then 3', function(){
          request('area.trainHandler.useElixir', {
            elixir: 500,
            cardId: 102
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '卡牌仙丹容量已满'
            });
          });
        });

        it('can not use elixir on card more than the max elixir', function(){
          request('area.trainHandler.useElixir', {
            elixir: 50,
            cardId: 101
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '使用的仙丹已经超出了卡牌的最大仙丹容量'
            });
          });
        });

      });

    });

  });
});
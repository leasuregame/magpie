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

      describe('when player level is less than 10', function(){
        beforeEach(function() {
          loginWith('user1', '1', 1);
        });

        it('should can not use elixir', function() {
          request('area.trainHandler.useElixir', {
            elixir: 1000,
            cardId: 100
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '10级开放'
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
            console.log(data);
            expect(data.code).toEqual(200);
            expect(data.msg.hp).toEqual(18846);
            expect(data.msg.atk).toEqual(7576);

          });

          doAjax('/player/' + arthur.playerId, function(res) {
            expect(res.data.elixir).toEqual(before_player.elixir - 500);
          });

          doAjax('/card/' + 100, function(res) {
            expect(res.data.elixirHp).toEqual(before_card.elixirHp + 500);
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
            cardId: 250
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '不能对3星以下的卡牌使用仙丹'
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
        it('can not use elixir on card will more than the max elixir', function(){
          request('area.trainHandler.useElixir', {
            elixir: 50,
            cardId: 102
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '卡牌仙丹容量已满'
            });
          });
        });

      });

      describe('当玩家等级小于50，而且将要使用的仙丹超过当前等级上限', function(){
        beforeEach(function(){
          doAjax('/update/player/' + arthur.playerId, {
            elixirPerLv: JSON.stringify({
              100: 600
            })
          }, function(res) {
            loginWith(arthur.account, arthur.password, arthur.areaId);
          });
        });

        it('should can not use elixir', function(){
          request('area.trainHandler.useElixir', {
            elixir: 500,
            cardId: 100
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '最多还可以消耗400点仙丹'
            });
          });
        });
      });

      describe('当玩家等级小于50，而且使用的仙丹还已经达到等级上限', function(){
        beforeEach(function(){
          doAjax('/update/player/' + 1, {
            elixirPerLv: JSON.stringify({
              1: 1000
            }),
            elixir: 2000
          }, function(res) {
            loginWith('1', '1', 1);
          });
        });

        it('should can not use elixir', function(){
          request('area.trainHandler.useElixir', {
            elixir: 500,
            cardId: 1
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '消耗的仙丹已达到当前玩家级别的上限'
            });
          });
        })
      });

    });

  });
});
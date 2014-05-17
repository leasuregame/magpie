describe("Area Server", function() {
  describe("Convertor Handler", function() {
    describe("area.convertorHandler.dissolveCard", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('当参数不正确时', function(){
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能熔炼卡牌', function() {
          request('area.convertorHandler.dissolveCard', {}, function(data) {
            expect(data).toEqual({
              code: 501, 
              msg: '参数错误'
            });
          });

          request('area.convertorHandler.dissolveCard', {
            cardIds: '1'
          }, function(data) {
            expect(data).toEqual({
              code: 501, 
              msg: '参数错误'
            });
          });
        });
      });

      describe('当玩家等级低于20级时', function(){
        beforeEach(function() {
          doAjax('/update/player/100', {lv: 19}, function(res) {
            loginWith('arthur', '1', 1);  
          });
        });

        it('熔炼功能不开放', function() {
          request('area.convertorHandler.dissolveCard', {cardIds: 100}, function(data) {
            expect(data).toEqual({
              code: 501, 
              msg: '20级开启'
            });
          });
        });
      });

      describe('当卡牌不存在时', function(){
        beforeEach(function() {
          doAjax('/update/player/100', {lv: 20}, function(res) {
            loginWith('arthur', '1', 1);  
          });          
        });

        it('不能熔炼卡牌', function() {
          request('area.convertorHandler.dissolveCard', {cardIds: 1254584}, function(data) {
            expect(data).toEqual({
              code: 501, 
              msg: '找不到卡牌'
            });
          });
        });
      });

      describe('当熔炼经验卡时', function(){
        var expCardId;

        beforeEach(function() {
          doAjax('/create/card', {
            tableId: 30000,
            playerId: 100,
            createTime: new Date().getTime(),
            passiveSkills: '[]'
          }, function(res){
            console.log('--a', res);
            expCardId = res.insertId;
          });

          doAjax('/update/player', {lv: 20}, function(res) {
            loginWith('arthur', '1', 1);  
          });          
        });

        it('不能熔炼卡牌', function() {
          request('area.convertorHandler.dissolveCard', {cardIds: expCardId}, function(data) {
            expect(data).toEqual({
              code: 501, 
              msg: '经验卡不能熔炼'
            });
          });
        });
      });

    });
  });
});
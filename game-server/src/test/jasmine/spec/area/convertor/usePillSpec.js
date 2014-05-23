describe("Area Server", function() {
  describe("Convertor Handler", function() {
    describe("area.convertorHandler.usePill", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('当参数不正确时', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能吞噬轮回丹', function(){
          request('area.convertorHandler.usePill', {
            cardId: 'a'
          }, function(data){
            expect(data).toEqual({code: 501, msg: '参数错误'})
          });

          request('area.convertorHandler.usePill', {
          }, function(data){
            expect(data).toEqual({code: 501, msg: '参数错误'})
          });

          request('area.convertorHandler.usePill', {
            cardId: 1,
            pill: 'nimade'
          }, function(data){
            expect(data).toEqual({code: 501, msg: '参数错误'})
          });

          request('area.convertorHandler.usePill', {
            cardId: 1
          }, function(data){
            expect(data).toEqual({code: 501, msg: '参数错误'})
          });

          request('area.convertorHandler.usePill', {
            pill: 10000
          }, function(data){
            expect(data).toEqual({code: 501, msg: '参数错误'})
          });
        });
      });

      describe('当玩家等级小于50', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 49
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能吞噬轮回丹', function(){
          request('area.convertorHandler.usePill', {
            cardId: 100,
            pill: 10000
          }, function(data){
            expect(data).toEqual({code: 501, msg: '50级开启'})
          });
        });
      });

      describe('当卡牌不存在时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 50
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能吞噬轮回丹', function(){
          request('area.convertorHandler.usePill', {
            cardId: -100,
            pill: 10000
          }, function(data){
            expect(data).toEqual({code: 501, msg: '找不到卡牌'});
          });
        });
      });

      describe('当吞噬的卡牌星级小于4时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 50
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能吞噬轮回丹', function(){
          request('area.convertorHandler.usePill', {
            cardId: 200,
            pill: 10000
          }, function(data){
            expect(data).toEqual({code: 501, msg: '4星以下卡牌不能吞噬轮回丹'});
          });
        });
      });

      describe('当轮回丹不足时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 50
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能吞噬轮回丹', function(){
          request('area.convertorHandler.usePill', {
            cardId: 102,
            pill: 10000
          }, function(data){
            expect(data).toEqual({code: 501, msg: '轮回丹不足'});
          });
        });
      });

      describe('当可以成功吞噬轮回丹时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 50,
            pill: 8000
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('能正确执行吞噬，并返回正确的结果', function(){
          request('area.convertorHandler.usePill', {
            cardId: 100,
            pill: 8000
          }, function(data){
            expect(data.code).toEqual(200);
            expect(data.msg.pill).toEqual(0);
            expect(data.msg.ability).toEqual(29653);

            doAjax('/player/100', function(res) {
              expect(res.data.pill).toEqual(0);
            });

            doAjax('/card/100', function(res) {
              expect(res.data.pill).toEqual(8000);
              expect(res.data.potentialLv).toEqual(1);
            });
          });
        });
      });

      describe('可以吞噬轮回丹，5星卡连续吞到最高等级', function(){

        beforeAll(function() {
          doAjax('/update/player/100', {
            lv: 50,
            pill: 60000
          }, function(res) {
            
          });
        });

        beforeEach(function(){
          loginWith('arthur', '1', 1);
        });

        it('潜能：0级->1级', function(){
          request('area.convertorHandler.usePill', {
            cardId: 103,
            pill: 8000
          }, function(data){
            expect(data.code).toEqual(200);
            expect(data.msg.pill).toEqual(52000);
            expect(data.msg.ability).toEqual(29653);

            doAjax('/player/100', function(res) {
              expect(res.data.pill).toEqual(52000);
            });

            doAjax('/card/103', function(res) {
              expect(res.data.pill).toEqual(8000);
              expect(res.data.potentialLv).toEqual(1);
            });
          });
        });

        it('潜能：1级->2级', function(){
          request('area.convertorHandler.usePill', {
            cardId: 103,
            pill: 10000
          }, function(data){
            expect(data.code).toEqual(200);
            expect(data.msg.pill).toEqual(42000);
            expect(data.msg.ability).toEqual(29653);

            doAjax('/player/100', function(res) {
              expect(res.data.pill).toEqual(42000);
            });

            doAjax('/card/103', function(res) {
              expect(res.data.pill).toEqual(18000);
              expect(res.data.potentialLv).toEqual(2);
            });
          });
        });

        it('潜能：2级->3级', function(){
          request('area.convertorHandler.usePill', {
            cardId: 103,
            pill: 12000
          }, function(data){
            expect(data.code).toEqual(200);
            expect(data.msg.pill).toEqual(30000);
            expect(data.msg.ability).toEqual(29653);

            doAjax('/player/100', function(res) {
              expect(res.data.pill).toEqual(30000);
            });

            doAjax('/card/103', function(res) {
              expect(res.data.pill).toEqual(30000);
              expect(res.data.potentialLv).toEqual(3);
            });
          });
        });

        it('潜能：3级->4级', function(){
          request('area.convertorHandler.usePill', {
            cardId: 103,
            pill: 14000
          }, function(data){
            expect(data.code).toEqual(200);
            expect(data.msg.pill).toEqual(16000);
            expect(data.msg.ability).toEqual(29653);

            doAjax('/player/100', function(res) {
              expect(res.data.pill).toEqual(16000);
            });

            doAjax('/card/103', function(res) {
              expect(res.data.pill).toEqual(44000);
              expect(res.data.potentialLv).toEqual(4);
            });
          });
        });

        it('潜能：4级->5级', function(){
          request('area.convertorHandler.usePill', {
            cardId: 103,
            pill: 16000
          }, function(data){
            expect(data.code).toEqual(200);
            expect(data.msg.pill).toEqual(0);
            expect(data.msg.ability).toEqual(29653);

            doAjax('/player/100', function(res) {
              expect(res.data.pill).toEqual(0);
            });

            doAjax('/card/103', function(res) {
              expect(res.data.pill).toEqual(60000);
              expect(res.data.potentialLv).toEqual(5);
            });
          });
        });

        it('潜能：5级->6级（升级不成功）', function(){
          request('area.convertorHandler.usePill', {
            cardId: 103,
            pill: 18000
          }, function(data){
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('卡牌潜能级别已达最高');
          });
        });

      });


    });
  });
});
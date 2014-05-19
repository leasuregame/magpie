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
            expect(data).toEqual({code: 501, msg: '4星以下卡牌不能吞噬轮回丹'});
          });
        });
      });

    });
  });
});
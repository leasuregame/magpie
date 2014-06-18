describe("Area Server", function() {
  describe("Exp Pass Handler", function() {
    describe("area.expPassHandler.attack", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });


      describe("当玩家可以攻打经验副本时", function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it("返回正确的结果，并得到正确经验卡奖励", function() {
          request('area.expPassHandler.attack', {
            id: 3
          }, function(data) {
            console.log(data);
            expect(data).toEqual([]);
          });

        });

      });

      describe('当等级不够时', function() {
        beforeEach(function() {
          loginWith('2', '1', 1);
        });

        it('不能攻击经验副本', function() {
          request('area.expPassHandler.attack', {
            id: 1
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: ''
            })
          });
        });

      });

      describe('当参数不正确时', function() {
        beforeEach(function() {
          loginWith('1', '1', 1);
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: 0
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: 4
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: 'a'
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it("不能攻击经验副本", function() {
          request('area.expPassHandler.attack', {
            id: {}
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

      });

    });
  });
});
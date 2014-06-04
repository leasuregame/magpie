describe("Area Server", function() {
  describe("Convertor Handler", function() {
    describe("area.convertorHandler.dissolveCard", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('当参数不正确时', function() {
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

      describe('当玩家等级低于20级时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 19
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('熔炼功能不开放', function() {
          request('area.convertorHandler.dissolveCard', {
            cardIds: 100
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '20级开启'
            });
          });
        });
      });

      describe('当卡牌不存在时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 20
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能熔炼卡牌', function() {
          request('area.convertorHandler.dissolveCard', {
            cardIds: 1254584
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '找不到卡牌'
            });
          });
        });
      });

      describe('当熔炼经验卡时', function() {
        var expCardId;

        beforeEach(function() {
          doAjax('/update/player', {
            lv: 20
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能熔炼卡牌', function() {
          request('area.convertorHandler.dissolveCard', {
            cardIds: 222
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '经验卡不能熔炼'
            });
          });
        });
      });

      describe('熔炼卡牌成功', function() {
        var cardIds = {
          1: 230,
          2: 231,
          3: 232,
          4: 233,
          5: 234,
          6: 235,
          7: 236
        };

        var outPuts = {
          "1": {
            "id": 1,
            "pill": 20,
            "money": 50
          },
          "2": {
            "id": 2,
            "pill": 40,
            "money": 250
          },
          "3": {
            "id": 3,
            "pill": 200,
            "money": 2500
          },
          "4": {
            "id": 4,
            "pill": 1000,
            "money": 10000
          },
          "5": {
            "id": 5,
            "pill": 8000,
            "money": 100000
          },
          "6": {
            "id": 6,
            "pill": 30000,
            "money": 250000
          },
          "7": {
            "id": 7,
            "pill": 50000,
            "money": 500000
          }
        }


        beforeEach(function() {
          doAjax('/update/player/100', {
            lv: 50,
            pill: 0,
            money: 0
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        function doTestDissolveCard(star) {

          describe(star + '星卡牌', function() {

            it('应该得到正确的轮回丹，用于熔炼的卡牌消失了', function() {
              request('area.convertorHandler.dissolveCard', {
                cardIds: cardIds[star]
              }, function(data) {
                console.log(data);
                expect(data.code).toEqual(200);

                doAjax('/player/100', function(res) {
                  expectData = outPuts[star];
                  expect(res.data.pill).toEqual(expectData.pill);
                  expect(res.data.money).toEqual(expectData.money);
                });

                doAjax('/card/' + cardIds[star], function(res) {
                  expect(res).toEqual({
                    code: 404,
                    data: 'card not exists'
                  });
                });
              });

            });

          });
        };

        doTestDissolveCard(1);
        doTestDissolveCard(2);
        doTestDissolveCard(3);
        doTestDissolveCard(4);
        doTestDissolveCard(5);
        doTestDissolveCard(6);
        doTestDissolveCard(7);

        describe('同时熔炼多张卡牌时', function() {

          it('可以正确执行', function() {
            var ids = [214, 215, 216, 217, 218, 219, 220];

            request('area.convertorHandler.dissolveCard', {
              cardIds: ids
            }, function(data) {
              expect(data).toEqual({
                code: 200,
                msg: {
                  pill: 200 * 7,
                  money: 2500 * 7
                }
              });

              doAjax('/player/100', function(res) {
                expect(res.data.pill).toEqual(200 * 7);
                expect(res.data.money).toEqual(2500 * 7);
              });

              _.each(ids, function(id) {
                doAjax('/card/' + id, function(res) {
                  expect(res).toEqual({
                    code: 404,
                    data: 'card not exists'
                  });
                });
              });

            });
          })
        });


      });
    });
  });
});
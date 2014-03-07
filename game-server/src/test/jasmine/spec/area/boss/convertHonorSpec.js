describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.convertHonor", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('参数为空时', function() {

        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('提示参数错误', function() {

          request('area.bossHandler.convertHonor', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });

          request('area.bossHandler.convertHonor', {
            number: 'number'
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });

          request('area.bossHandler.convertHonor', {
            number: -2
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });

        });

      });


      describe('当荣誉点不足时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            honor: 1000
          }, function() {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能兑换', function() {
          request('area.bossHandler.convertHonor', {
            number: 1
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '荣誉点不足'
            });
          });

          doAjax('/update/player/100', {
            honor: 10000
          }, function() {
            pomelo.disconnect();
            initPomelo();
            loginWith('arthur', '1', 1);
          });

          request('area.bossHandler.convertHonor', {
            number: 2
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '荣誉点不足'
            });
          });

        });
      });

      describe('可以兑换时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            honor: 20000
          }, function() {
            loginWith('arthur', '1', 1);
          });
        });


        it('兑换成功，并返回结果', function() {
          request('area.bossHandler.convertHonor', {
            number: 3
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 200,
              msg: {
                honor: 2000,
                superHonor: 3
              }
            });

            doAjax('/player/100', function(res) {
              expect(res.data.honor).toEqual(2000);
              expect(res.data.superHonor).toEqual(3);
            });

          });
        });
      });

    });
  });
});
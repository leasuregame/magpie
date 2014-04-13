describe("Area Server", function() {
  describe("Buy Handler", function() {
    describe("area.buyHandler.buyProduct, buy speaker", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });


      describe('当魔石不足时', function() {
        beforeEach(function() {
          doAjax('/update/player/106', {
            gold: 4
          }, function(err, res) {
            loginWith('poorman', '1', 1);
          });
        });

        it('不能购买', function() {
          request("area.buyHandler.buyProduct", {
            id: 8
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '魔石不足'
            });
          });
        });
      });

      describe('当拥有的喇叭数量过大时', function() {
        beforeEach(function() {
          doAjax('/update/player/106', {
            gold: 100,
            speaker: 997
          }, function(err, res) {
            loginWith('poorman', '1', 1);
          });
        });

        it('不能购买', function() {
          request("area.buyHandler.buyProduct", {
            id: 8,
            times: 5
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '亲，您还有很多喇叭可用呢'
            });
          });
        });
      });

      describe('当魔石足够时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            gold: 10000,
            speaker: 0
          }, function(err, res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('购买成功', function() {
          
          request("area.buyHandler.buyProduct", {
            id: 8,
            times: 1
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                consume: {
                  key: 'gold',
                  value: 9980
                },
                speaker: 1
              }
            });

            doAjax('/player/100', function(res){
              expect(res.data.gold).toEqual(9980);
              expect(res.data.speaker).toEqual(1);
            });
          });

          request("area.buyHandler.buyProduct", {
            id: 8,
            times: 5
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                consume: {
                  key: 'gold',
                  value: 9880
                },
                speaker: 6
              }
            });

            doAjax('/player/100', function(res){
              expect(res.data.gold).toEqual(9880);
              expect(res.data.speaker).toEqual(6);
            });
          });

          request("area.buyHandler.buyProduct", {
            id: 8,
            times: 10
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                consume: {
                  key: 'gold',
                  value: 9720
                },
                speaker: 16
              }
            });

            doAjax('/player/100', function(res){
              expect(res.data.gold).toEqual(9720);
              expect(res.data.speaker).toEqual(16);
            });
          });

          request("area.buyHandler.buyProduct", {
            id: 8,
            times: 15
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                consume: {
                  key: 'gold',
                  value: 9480
                },
                speaker: 31
              }
            });

            doAjax('/player/100', function(res){
              expect(res.data.gold).toEqual(9480);
              expect(res.data.speaker).toEqual(31);
            });
          });
        });

      });

    });
  });
});
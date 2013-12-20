describe("Area Server", function() {

  describe("Train Handler", function() {

    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.getExchangeCards", function() {

      var checkResult = function(data, star) {
        console.log(data);
        expect(data.code).toEqual(200);
        expect(data.msg.ids.length).toEqual(4);

        for (var i = 0; i < data.msg.ids.length; i++) {
          var id = data.msg.ids[i];
          expect([4, 5]).toContain(id % 5 || 5);
        }
      };
      describe('when get exchange cards', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('should can get card ids from server by the specific star', function() {
          request('area.trainHandler.getExchangeCards', {}, function(data) {
            checkResult(data);

            doAjax('/player/100', function(res) {
              expect(res.data.exchangeCards).toEqual(JSON.stringify(daa.msg.ids));
            });
          });
        });

      });

      describe('when money is not enought', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            money: 0
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('should can not get exchange cards', function() {
          request('area.trainHandler.getExchangeCards', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '仙币不足'
            });
          });
        });
      });

    });
  });
});
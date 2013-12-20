describe("Area Server", function() {

  describe("Train Handler", function() {

    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.getExchangeCards", function() {
      beforeEach(function() {
        loginWith('arthur', '1', 1);
      });

      var checkResult = function(data, star) {
        console.log(data);
        expect(data.code).toEqual(200);
        expect(data.msg.ids.length).toEqual(4);

        for (var i = 0; i < data.msg.ids.length; i++) {
          var id = data.msg.ids[i];
          expect([4,5]).toContain(id % 5 || 5);
        }
      };
      describe('when get exchange cards', function() {

        it('should can get card ids from server by the specific star', function() {
          request('area.trainHandler.getExchangeCards', {}, function(data) {
            checkResult(data);
          });
        });

      });

    });
  });
});
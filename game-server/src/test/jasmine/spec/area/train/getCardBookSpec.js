describe("Area Server", function() {

  describe("Train Handler", function() {
    var user115 = {
      id: 1,
      playerId: 115,
      areaId: 1,
      account: '115',
      password: '1'
    };
    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.getCardBook", function() {
      beforeEach(function() {
        loginWith(user115.account, user115.password, user115.areaId);
      });

      it('should can get card book from server', function() {
        request('area.trainHandler.getCardBook', {}, function(data) {
          expect(data).toEqual({
            code: 200,
            msg: {
              cardBook: {
                mark: [17318416],
                flag: []
              }
            }
          });
        });
      });

    });
  });
});
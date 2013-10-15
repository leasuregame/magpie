describe("Area Server", function() {

  describe("Train Handler", function() {
    var user1 = {
      id: 1,
      playerId: 1,
      areaId: 1,
      account: '1',
      password: '1'
    };
    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.getCardBook", function() {
      beforeEach(function() {
        loginWith(user1.account, user1.password, user1.areaId);
      });

      it('should can get card book from server', function() {
        request('area.trainHandler.getCardBook', {}, function(data) {
          expect(data).toEqual({
            code: 200,
            msg: {
              cardBook: {
                mark: [538054660, 2],
                flag: []
              }
            }
          });
        });
      });

    });
  });
});
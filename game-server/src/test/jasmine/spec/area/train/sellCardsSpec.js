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

    describe("area.trainHandler.sellCards", function() {
      beforeEach(function() {
        loginWith(user1.account, user1.password, user1.areaId);
      });

      it("should can sell my specific cards", function() {
        request(
          'area.trainHandler.sellCards', {
            ids: []
          },
          function(data) {
            console.log(data);
            expect(data).toEqual({});
          }
        );
      });
    });
  });
});
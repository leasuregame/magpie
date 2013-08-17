describe("Area Server", function() {

  describe("Train Handler", function() {
    var arthur = {
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

    describe("area.trainHandler.changeLineUp", function() {
      beforeEach(function() {
        loginWith(arthur.account, arthur.password, arthur.areaId);
      });

      it("should can be change player's lineUp", function() {
        request(
          'area.trainHandler.changeLineUp', {
            lineUp: {
              1: 5,
              2: 4,
              3: 3,
              4: 2,
              5: 1
            }
          },
          function(data) {
            expect(data.code).toEqual(200);
            expect(data.msg.lineUp).toEqual({
              1: 5,
              2: 4,
              3: 3,
              4: 2,
              5: 1
            });
          }
        );
      });
    });
  });
});
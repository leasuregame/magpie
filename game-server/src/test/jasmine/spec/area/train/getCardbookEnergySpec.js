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

    describe("area.trainHandler.getCardBookEnergy", function() {
      beforeEach(function() {
        loginWith(user1.account, user1.password, user1.areaId);
      });

      describe('when card is light up', function() {
        it("should can get cardBook energy", function() {
          request(
            'area.trainHandler.getCardBookEnergy', {
              tableId: 3
            },
            function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 200,
                msg: {
                  energy: 10
                }
              });
            }
          );

        });
      });

      describe('when card is not light up', function() {
        it("should can get cardBook energy", function() {
          request(
            'area.trainHandler.getCardBookEnergy', {
              tableId: 20
            },
            function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 501,
                msg: '不能领取，已经领过或者还没有点亮该卡牌'
              });
            }
          );

        });
      })

    });
  });
});
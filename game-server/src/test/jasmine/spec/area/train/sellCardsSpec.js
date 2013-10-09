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

      describe('when sell cards than i have', function() {
        it("should can sell my specific cards", function() {
          var before_player;
          doAjax('/player/' + user1.playerId, {}, function(res) {
            before_player = res.data;
          });

          ids = [1, 2, 3, 4, 5, 11];
          request(
            'area.trainHandler.sellCards', {
              ids: ids
            },
            function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 200,
                msg: {
                  price: 6070
                }
              });

              for (var i = 0; i < ids.length; i++) {
                (function(i) {
                  doAjax('/card/' + i, {}, function(res) {
                    expect(res).toEqual({
                      code: 404,
                      data: 'card not exists'
                    });
                  })
                })(i);
              }

              doAjax('/player/' + user1.playerId, {}, function(res) {
                expect(res.data.money).toEqual(before_player.money + data.msg.price);
              });
            }
          );

        });

      });

      describe("when parameter ids is empty", function() {
        it('should can not sell cards', function() {
          request(
            'area.trainHandler.sellCards', {
              ids: []
            },
            function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 200,
                msg: {
                  price: 0
                }
              });
            }
          );
        });
      });

      describe("when card is not exist", function() {
        it('should can not sell cards', function() {
          request(
            'area.trainHandler.sellCards', {
              ids: [1000, 10001, 100001]
            },
            function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 501,
                msg: '找不到卡牌'
              });
            }
          );
        });
      });

      describe("when card is not mine", function() {
        it('should can not sell cards', function() {
          request(
            'area.trainHandler.sellCards', {
              ids: [6, 7, 8]
            },
            function(data) {
              console.log(data);
              expect(data).toEqual({
                code: 501,
                msg: '找不到卡牌'
              });
            }
          );
        });
      });

    });
  });
});
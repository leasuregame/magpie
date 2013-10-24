describe("Area Server", function() {

  describe("Train Handler", function() {
    var user3 = {
      id: 3,
      playerId: 3,
      areaId: 1,
      account: '3',
      password: '1'
    };
    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.getCardBookEnergy", function() {
      beforeEach(function() {
        loginWith(user3.account, user3.password, user3.areaId);
      });

      var energys = {
        1: 50,
        2: 80,
        3: 100,
        4: 300,
        5: 500
      };
      var flags = {
        1: 1,
        2: 3,
        3: 7,
        4: 15,
        5: 31
      }

      describe('when card is light up', function() {
        var before_player;
        beforeEach(function() {
          doAjax('/player/' + user3.playerId, {}, function(res) {
            before_player = res.data;
          });
        });

        for (var i = 1; i <= 5; i++) {
          (function(id) {
            it("should can get cardBook energy from tableId " + id, function() {
              request(
                'area.trainHandler.getCardBookEnergy', {
                  tableId: id
                },
                function(data) {
                  console.log(data);
                  expect(data).toEqual({
                    code: 200,
                    msg: {
                      energy: energys[id]
                    }
                  });

                  doAjax('/player/' + user3.playerId, {}, function(res) {
                    expect(res.data.energy).toEqual(before_player.energy + data.msg.energy);
                    expect(JSON.parse(res.data.cardBook).flag).toEqual([flags[id]]);
                  });
                }
              );

            });
          })(i);
        }

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
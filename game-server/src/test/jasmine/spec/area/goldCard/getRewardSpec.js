describe("Area Server", function() {

  describe("Card Handler", function() {
    var pomelo = window.pomelo;
    var userid;

    var shortDateString = function(now) {
      return "" + (now.getFullYear()) + "-" + (now.getMonth() + 1) + "-" + (now.getDate());
    }

    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {});
    });

    describe('area.cardHandler.getReward', function() {
      describe('when player not buy a gold card', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('should can not get gold card reward', function() {
          request('area.cardHandler.getReward', {
            productId: 'com.leasuregame.magpie.week.card.pay6'
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '没有购买，不能领取'
            });
          });
        });

      });

      describe('when gold card has expired', function() {
        var created = new Date();
        created.setDate(created.getDate() - 7);
        var validDate = new Date();
        validDate.setDate(validDate.getDate() - 1);

        beforeEach(function() {
          doAjax('/create/goldCard', {
            orderId: 100000,
            orderNo: 'order100000',
            playerId: 100,
            type: 'com.leasuregame.magpie.week.card.pay6',
            created: shortDateString(created),
            validDate: shortDateString(validDate)
          }, function(res) {
            loginWith('arthur', '1', 1);
          });
        });

        it('should can not get gold card reward', function() {
          request('area.cardHandler.getReward', {
            productId: 'com.leasuregame.magpie.week.card.pay6'
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '已过期，不能领取'
            });
          });
        });

      });

      describe('when player has get gold card reward', function() {
        var created = new Date();
        created.setDate(created.getDate());
        var validDate = new Date();
        validDate.setDate(validDate.getDate() + 6);

        beforeEach(function() {
          doAjax('/create/goldCard', {
            orderId: 100001,
            orderNo: 'order100001',
            playerId: 101,
            type: 'com.leasuregame.magpie.week.card.pay6',
            flag: 1,
            created: shortDateString(created),
            validDate: shortDateString(validDate)
          }, function(res) {
            loginWith('user4', '1', 1);
          });
        });

        it('should can not get gold card reward', function() {
          request('area.cardHandler.getReward', {
            productId: 'com.leasuregame.magpie.week.card.pay6'
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '不能重复领取'
            });
          });
        });

      });

      describe('when player can get gold card reward', function() {
        var created = new Date();
        created.setDate(created.getDate());
        var validDate = new Date();
        validDate.setDate(validDate.getDate() + 6);

        beforeEach(function() {
          doAjax('/create/goldCard', {
            orderId: 100001,
            orderNo: 'order100001',
            playerId: 1,
            type: 'com.leasuregame.magpie.week.card.pay6',
            created: shortDateString(created),
            validDate: shortDateString(validDate)
          }, function(res) {
            loginWith('1', '1', 1);
          });
        });

        it('should can not get gold card reward', function() {
          request('area.cardHandler.getReward', {
            productId: 'com.leasuregame.magpie.week.card.pay6'
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 200,
              msg: {
                gold: 1060,
                goldCards: {
                  id: 3,
                  type: 'com.leasuregame.magpie.week.card.pay6',
                  remainingDays: 7,
                  hasGot: 1
                }
              }
            });

            doAjax('/goldCard/3', function(res) {
              expect(res.data.type).toEqual('com.leasuregame.magpie.week.card.pay6');
              expect(res.data.flag).toEqual(1);
            });

            doAjax('/player/1', function(res) {
              expect(res.data.gold).toEqual(1060);
            });
          });
        });

      });



    });
  });
});
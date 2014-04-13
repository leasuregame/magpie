describe("Area Server", function() {

  describe("Train Handler", function() {
    var arthur = {
      id: 100,
      playerId: 100,
      areaId: 1,
      account: 'arthur',
      password: '1'
    };
    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    // 技能升级
    describe("area.trainHandler.skillUpgrade", function() {
      describe('upgrade skill', function() {


        var before_player, before_card;

        beforeEach(function() {
          loginWith(arthur.account, arthur.password, arthur.areaId);

          doAjax('/player/' + arthur.playerId, {}, function(res) {
            before_player = res.data;
          });

          doAjax('/card/' + 100, {}, function(res) {
            before_card = res.data;
          });
        });

        it("card's skill should can be upgrade", function() {
          request('area.trainHandler.skillUpgrade', {
            cardId: 100
          }, function(data) {
            expect(data.code).toEqual(200);
            console.log(data);

            doAjax('/player/' + arthur.playerId, {}, function(res) {
              expect(res.data.skillPoint).toEqual(before_player.skillPoint - data.msg.skillPoint);
            });

            doAjax('/card/' + 100, {}, function(res) {
              expect(res.data.skillLv).toEqual(before_card.skillLv + 1);
            });
          });
        });

        describe("when target card is not exists", function() {
          it("can not upgrade card skill", function() {
            request('area.trainHandler.skillUpgrade', {
              cardId: 0
            }, function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('找不到卡牌');
            })
          });
        });

        describe("when target card's star is less than 3", function() {
          it("can not upgrade card skill", function() {
            request('area.trainHandler.skillUpgrade', {
              cardId: 110
            }, function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('三星级以下的卡牌没有技能，不能升级');
            })
          });
        });

        describe("when target card's star is 5(max star)", function() {
          it("can not upgrade card skill", function() {
            request('area.trainHandler.skillUpgrade', {
              cardId: 103
            }, function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('该卡牌的技能等级已经升到最高级，不能再升级了');
            });
          });
        });

      });

      describe("when player's skillPoint is not enought", function() {
        var user1 = {
          account: '3',
          password: '1',
          playerId: 3,
          id: 3,
          areaId: 1
        };
        beforeEach(function() {
          loginWith(user1.account, user1.password, user1.areaId);
        });

        it("can not upgrade card skill", function() {
          request('area.trainHandler.skillUpgrade', {
            cardId: 13
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('技能点不够，不能升级');
          });
        });

      });

      describe('when player level is less than 10', function() {
        beforeEach(function() {
          doAjax('/update/player/101', {
            lv: 9
          }, function(res) {
            loginWith('user4', '1', 1);
          });
        });

        it('cant not updade skill of card', function() {
          request('area.trainHandler.skillUpgrade', {
            cardId: 105
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('10级开放');
          });

        });
      });
    });

  });

});
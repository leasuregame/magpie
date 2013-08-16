describe("Logic Server # ", function() {
  var pomelo = window.pomelo;
  var userid;

  beforeAll(function() {
    doAjax('/loaddata/csv', {}, function(data) {
      expect(data).toEqual('done');
    });
  });

  describe("Task Handler", function() {
    var pid = 100;

    

    // 技能升级
    describe("area.trainHandler.skillUpgrade", function() {
      var before_player, before_card;

      beforeEach(function() {
        doAjax('/player/' + pid, {}, function(res) {
          before_player = res.data;
        });

        doAjax('/card/' + 100, {}, function(res) {
          before_card = res.data;
        });
      });

      it("card's skill should can be upgrade", function() {
        request('area.trainHandler.skillUpgrade', {
          playerId: pid,
          cardId: 100
        }, function(data) {
          expect(data.code).toEqual(200);
          console.log(data);

          doAjax('/player/' + pid, {}, function(res) {
            expect(res.data.skillPoint).toBeLessThan(before_player.skillPoint);
          });

          doAjax('/card/' + 100, {}, function(res) {
            expect(res.data.skillLv).toEqual(before_card.skillLv + 1);
          });
        });
      });

      describe("when target card is not exists", function() {
        it("can not upgrade card skill", function() {
          request('area.trainHandler.skillUpgrade', {
            playerId: pid,
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
            playerId: 1,
            cardId: 4
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('三星级以下的卡牌没有技能，不能升级');
          })
        });
      });

      describe("when target card's star is 5(max star)", function() {
        it("can not upgrade card skill", function() {
          request('area.trainHandler.skillUpgrade', {
            playerId: pid,
            cardId: 103
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('该卡牌的技能等级已经升到最高级，不能再升级了');
          })
        });
      });

      describe("when player's skillPoint is not enought", function() {
        it("can not upgrade card skill", function() {
          request('area.trainHandler.skillUpgrade', {
            playerId: 107,
            cardId: 163
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('技能点不够，不能升级');
          })
        });
      });

    });

    describe("area.trainHandler.passSkillAfresh", function() {

      it("card's pass skill should can be passSkillAfresh", function() {
        request('area.trainHandler.passSkillAfresh', {
          playerId: pid,
          cardId: 101,
          psIds: [6]
        }, function(data) {
          expect(data.code).toEqual(200);

          setTimeout(function() {
            doAjax('/passiveSkill/' + 6, {}, function(res) {
              expect(res.data.name).toEqual(data.msg[0].name);
              expect(res.data.value).toEqual(data.msg[0].value);
            });
          }, 2000);
          console.log(data);
        });
      });

      describe("when money is not enought", function() {
        it("should can not afrash", function() {
          request('area.trainHandler.passSkillAfresh', {
            playerId: 106,
            cardId: 164,
            psIds: [7]
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('铜板/元宝不足，不能洗炼');
            console.log(data);
          });
        });
      });

      describe("when passiveSkill is not exists", function() {
        it("should can not afrash", function() {
          request('area.trainHandler.passSkillAfresh', {
            playerId: pid,
            cardId: 104,
            psIds: [7]
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('找不到被动属性');
            console.log(data);
          });
        });
      });

    });

    describe("area.trainHandler.smeltElixir", function() {
      var before_player;

      beforeEach(function() {
        doAjax('/player/' + pid, {}, function(res) {
          before_player = res.data;
        });
      });


      it("card should can be smelt to elixir", function() {
        request('area.trainHandler.smeltElixir', {
          playerId: pid,
          cardIds: [170, 171, 172]
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).hasProperties([
            'elixir',
            'sum'
          ]);
          expect(data.msg.elixir.length).toEqual(3);

          doAjax('/player/' + pid, {}, function(res) {
            expect(res.data.elixir).toEqual(before.elixir + data.msg.sum);
          });

        });
      });

      it("when all card is not exists, should can not smelt", function() {
        request('area.trainHandler.smeltElixir', {
          playerId: pid,
          cardIds: [161, 162]
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(501);
          expect(data.msg).toEqual('找不到卡牌');
        });
      });
    });

    describe("area.trainHandler.changeLineUp", function() {
      it("should can be change player's lineUp", function() {
        request(
          'area.trainHandler.changeLineUp', {
            playerId: '1',
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
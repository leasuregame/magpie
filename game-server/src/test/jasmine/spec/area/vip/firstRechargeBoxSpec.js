describe("Area Server", function() {
  describe("Vip Handler", function() {
    describe("area.vipHandler.firstRechargeBox", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('当玩家还没有充值', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能领取', function() {
          request('area.vipHandler.firstRechargeBox', {}, function(data) {
            console.log(data);

            expect(data).toEqual({
              code: 501,
              msg: '无权限领取该礼包'
            });
          });
        });

      });

      describe('当玩家已经充值了', function() {
        var before_player;
        describe('还没领取', function() {
          beforeEach(function() {
            doAjax('/update/player/100', {
              cash: 100
            }, function(res) {
              loginWith('arthur', '1', 1);
              doAjax('/player/100', function(res) {
                before_player = res.data;
              });              
            });
          });

          it('可以领取', function() {
            request('area.vipHandler.firstRechargeBox', {}, function(data) {
              console.log(data);

              expect(data.msg.card.passiveSkills.length).toEqual(2);
              expect(_.pick(data.msg.card, ['id', 'tableId', 'lv', 'exp', 'skillLv', 'skillPoint', 'elixirHp', 'elixirAtk'])).toEqual({
                id: 405,
                tableId: 194,
                lv: 20,
                exp: 0,
                skillLv: 1,
                skillPoint: 0,
                elixirHp: 0,
                elixirAtk: 0
              });

              doAjax('/player/100', function(res) {
                console.log(res.data);
                expect(res.data.energy).toEqual(before_player.energy + 8000);
                expect(res.data.elixir).toEqual(before_player.elixir + 10000);
                expect(res.data.money).toEqual(before_player.money + 80000);
                expect(res.data.skillPoint).toEqual(before_player.skillPoint + 10000);
                expect(JSON.parse(res.data.spiritor).spirit).toEqual(JSON.parse(before_player.spiritor).spirit + 1000);
                expect(JSON.parse(res.data.power).value).toEqual(250);
              });

            });
          });
        });

        describe('还没领取,没有frb字段', function(){
          beforeEach(function() {
            doAjax('/update/player/100', {
              cash: 100,
              firstTime: JSON.stringify({
                lowLuckyCard: 1,
                highLuckyCard: 1,
                highTenLuckCard: 1,
                recharge: 0
              })
            }, function(res) {
              loginWith('arthur', '1', 1);
              doAjax('/player/100', function(res) {
                before_player = res.data;
              });              
            });
          });

          it('可以领取', function() {
            request('area.vipHandler.firstRechargeBox', {}, function(data) {
              console.log(data);

              expect(data.msg.card.passiveSkills.length).toEqual(2);
              expect(_.pick(data.msg.card, ['id', 'tableId', 'lv', 'exp', 'skillLv', 'skillPoint', 'elixirHp', 'elixirAtk'])).toEqual({
                id: 405,
                tableId: 194,
                lv: 20,
                exp: 0,
                skillLv: 1,
                skillPoint: 0,
                elixirHp: 0,
                elixirAtk: 0
              });

              doAjax('/player/100', function(res) {
                console.log(res.data);
                expect(res.data.energy).toEqual(before_player.energy + 8000);
                expect(res.data.elixir).toEqual(before_player.elixir + 10000);
                expect(res.data.money).toEqual(before_player.money + 80000);
                expect(res.data.skillPoint).toEqual(before_player.skillPoint + 10000);
                expect(JSON.parse(res.data.spiritor).spirit).toEqual(JSON.parse(before_player.spiritor).spirit + 1000);
                expect(JSON.parse(res.data.power).value).toEqual(250);
              });

            });
          });
        });

        describe('已经领取', function() {
          beforeEach(function() {
            doAjax('/update/player/100', {
              cash: 100,
              firstTime: JSON.stringify({
                lowLuckyCard: 1,
                highLuckyCard: 1,
                highTenLuckCard: 1,
                frb: 0, // 首次充值礼包是否领取标记
                recharge: 0
              })
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('不能领取', function() {
            request('area.vipHandler.firstRechargeBox', {}, function(data) {
              console.log(data);

              expect(data).toEqual({
                code: 501,
                msg: '已领取'
              })
            });
          });
        });

      });


    });
  });
});
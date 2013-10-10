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

    describe("area.trainHandler.passSkillAfresh", function() {
      beforeEach(function() {
        loginWith(arthur.account, arthur.password, arthur.areaId);
      });

      it("card's pass skill should can be passSkillAfresh", function() {
        request('area.trainHandler.passSkillAfresh', {
          playerId: arthur.playerId,
          cardId: 101,
          psIds: [0]
        }, function(data) {
          expect(data.code).toEqual(200);

          doAjax('/card/' + 101, {}, function(res) {
            console.log(res);
            var pss = res._data.passiveSkills;
            expect(pss[0].name).toEqual(data.msg[0].name);
            expect(pss[0].value).toEqual(data.msg[0].value);
          });

          console.log(data);
        });
      });
    });

    describe("when money is not enought", function() {
      beforeEach(function() {
        loginWith('poorman', '1', 1);
      });

      it("should can not afrash", function() {
        request('area.trainHandler.passSkillAfresh', {
          cardId: 164,
          psIds: [0]
        }, function(data) {
          expect(data.code).toEqual(501);
          expect(data.msg).toEqual('铜板/元宝不足，不能洗炼');
          console.log(data);
        });
      });
    });

    describe("when passiveSkill is not exists", function() {
      beforeEach(function() {
        loginWith(arthur.account, arthur.password, arthur.areaId);
      });

      it("should can not afrash", function() {
        request('area.trainHandler.passSkillAfresh', {
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

});
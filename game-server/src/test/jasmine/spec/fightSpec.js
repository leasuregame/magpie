describe("Battle Server", function() {

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

  describe("Fight Handler", function() {

    describe("battle.fightHandler.attack", function() {
      beforeEach(function() {
        loginWith(user1.account, user1.password, user1.areaId);
      });

      it("should can be return the correct battle log", function() {
        request('battle.fightHandler.attack', {
          playerId: 1,
          targetId: 2
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).toBeBattleLog();
        });
      });
    });

  });

});
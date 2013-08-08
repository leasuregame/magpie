describe("Battle Server # ", function() {

  beforeAll(function() {
    doAjax('/loaddata/csv', {}, function(data) {
      expect(data).toEqual('done');
    });
  });

  describe("Fight Handler", function(){

    describe("battle.fightHandler.attack", function(){
      it("should can be return the correct battle log", function(){
        request('battle.fightHandler.attack', {playerId: 1, targetId: 2}, function(data){
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).toBeBattleLog();
        });
      });
    });

  });

});
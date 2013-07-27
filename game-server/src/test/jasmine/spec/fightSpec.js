describe("Battle Server # ", function() {

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });

    it('load test data form csv files', function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });
  });

  describe("Fight Handler", function(){

    describe("battle.fightHandler.attack", function(){
      it("should can be return the correct battle log", function(){
        request('battle.fightHandler.attack', {playerId: 1, targetId: 2}, function(data){
          expect(data.code).toEqual(200);
          expect(data.msg).toBeBattleLog();
        });
      });
    });

  });

  describe("tear down", function() {
    it('disconnect', function(){
      pomelo.disconnect();
    });
  });

});
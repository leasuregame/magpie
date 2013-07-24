describe("Battle Server # ", function() {

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });

    it('load test data form csv files', function() {
      doAjax('/loadDataFromCsvFile', {}, function(data) {
        expect(data).toEqual('done');
      });
    });
  });

  describe("Fight Handler", function(){

    describe("battle.fightHandler.attack", function(){
      it("should can be return the correct battle log", function(){
        request('battle.fightHandler.attack', {playerId: 1, targetId: 2}, function(data){
          expect(data.code).toEqual(200);
          bl = JSON.parse(data.msg);

          expect(bl).toEqual('')
          console.log(bl);
          expect(bl.enemy).toEqual(jasmine.any(Object));
          expect(bl.winner).toEqual('enemy');
          expect(bl.steps).toEqual(jasmine.any(Array));
          
          expect(_.filter(bl.enemy.cards, function(c) { return c;}).length).toEqual(5);
          expect(_.filter(bl.own.cards, function(c){ return c!==null;}).length).toEqual(5);

          expect(_.filter(bl.steps, function(s){
            return s.death && Math.abs(s.d) < 6;
          }).length).toEqual(5);
          console.log(data);
        });
      });
    });

  });

});
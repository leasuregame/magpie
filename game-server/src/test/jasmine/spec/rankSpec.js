describe("Ranking List", function() {

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });

    it("init db and load test data", function(){
      doAjax('/loaddata/all', {}, function(data) {
          expect(data).toEqual('done');
      });
    });

  });

  describe("ranking list", function() {
    var ids = [20000, 17000, 15000, 13000, 11000, 10700, 10300, 10199, 10013, 10001];
    var steps = [100, 80, 60, 40, 20, 15, 10, 5, 1, 1];

    var genRankings = function(rank, stepIndex) {
      var top10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      if (rank <= 10) {
        return top10;
      }
      var results = []
      for (var i = 0; i < 10; i++) {
        results.push(rank - steps[stepIndex] * i);
      }
      return _.union(top10, results.reverse());
    };


    ids.map(function(id, index) {

      describe("when my ranking is " + (id - 9999), function(){
        it('should can be return correct ranking list for (' + (id - 9999) + ')', function() {
          request('logic.rankHandler.rankingList', {
            playerId: id
          }, function(data) {
            var cur_ranking = id - 9999;
            //expect(data).toEqual('');
            //expect(data.msg[data.msg.length - 1].ranking).toEqual(cur_ranking);

            expect(_.map(data.msg, function(p) {
              return p.ranking;
            }).sort(function(a, b) {
              return a - b;
            })).toEqual(genRankings(cur_ranking, index));
            console.log(data);
          });
        });

      });

    });

  });

  describe("challenge", function() {
    describe("when one challenge to other", function() {
      it("should can be return battle log", function() {
        request('logic.rankHandler.challenge', {
            playerId: 100,
            targetId: 101
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(200);
            expect(data.msg.battleLog).toBeBattleLog();
            expect(data.msg.battleLog.winner).toEqual('enemy')
            expect(data.msg.battleLog.rewards).toEqual({})
            expect(data.msg.pass).toEqual({ layer : 25, mark : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] });
          });
      });
    })
  });

  describe("tear down", function() {
    it('disconnect', function(){
      pomelo.disconnect();
    });
  });

});
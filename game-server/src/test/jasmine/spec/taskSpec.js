var doAjax = function(url, params, cb) {
  var ok = false;
  runs(function() {
    $.get(url, params, function(data) {
      cb(data);
      ok = true;
    });
  });

  waits(function() {
    return ok;
  });
};

describe("Logic Server # ", function() {
  var pomelo = window.pomelo;
  var inited = false;
  var userid;

  var request = function(route, msg, cb) {
    var ok = false;
    runs(function() {
      pomelo.request(route, msg, function(data) {
        ok = true;
        cb(data);
      });
    });

    waitsFor(function() {
      return ok;
    });
  };

  var intiPomelo = function() {
    runs(function() {
      pomelo.init({
        host: '127.0.0.1',
        port: '3010'
      }, function() {
        console.log('connect success!');
        inited = true;
      });
    });
    waitsFor(function() {
      return inited;
    });
  };

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

  describe("Task Handler", function() {
    var pid = 100;

    describe("logic.taskHandler.explore", function() {

      it("should can be return the correct battle log", function() {
        request('logic.taskHandler.explore', {
          playerId: pid,
          taskId: 6
        }, function(data) {
          expect(data.code).toEqual(200);
          expect(data.msg).toBeDefined();
          expect(_.keys(data.msg).sort()).toEqual([
            'result', 
            'power_consume', 
            'exp_obtain', 
            'money_obtain', 
            'upgrade', 
            'open_box_card',
            'battle_log', 
            'fragment'
          ].sort());
          console.log(data);
        });
      });
    });

    describe("logic.taskHandler.passBarrier", function() {

      it("should can be execute and return result of pass barrier", function() {
        request('logic.taskHandler.passBarrier', {
          playerId: pid
        }, function(data) {
          expect(data.code).toEqual(200);
          expect(data.msg).toBeDefined();
          expect(_.keys(data.msg).sort()).toEqual([
            'enemy',
            'own',
            'winner',
            'steps',
            'rewards'
            ].sort());
          console.log(data);
        });
      });

    });

    describe("logic.taskHandler.wipeOut", function(){

      it("任务 should can be 扫荡", function(){
        request('logic.taskHandler.wipeOut', {playerId: pid, type: 'task'}, function(data){
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'exp_obtain',
            'money_obtain',
            'gold_obtain'
            ].sort());
          console.log(data);
        });
      });

    });

    describe("logic.taskHandler.wipeOut", function(){

      it("精英关卡 should can be 扫荡", function(){
        request('logic.taskHandler.wipeOut', {playerId: pid, type: 'pass'}, function(data){
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'exp_obtain',
            'money_obtain',
            'gold_obtain',
            'skill_point'
            ].sort());
          console.log(data);
        });
      });

    });

    describe("logic.trainHandler.luckyCard", function() {
      it("should can be get a lucky card", function(){
        request('logic.trainHandler.luckyCard', {playerId: pid, type: 1, level: 1}, function(data) {
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'card', 
            'consume', 
            'hasFragment'
            ].sort());
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.strengthen", function() {
      it("should can be strenthen, and return properties", function(){
        request('logic.trainHandler.strengthen', {playerId: pid, target: 100, sources: [103,102]}, function(data) {
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'exp_obtain', 
            'money_consume', 
            'upgraded_level'
            ].sort());
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.skillUpgrade", function() {
      it("card's skill should can be upgrade", function(){
        request('logic.trainHandler.skillUpgrade', {playerId: pid, cardId: 100}, function(data) {
          expect(data.code).toEqual(200);
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.passSkillAfresh", function() {
      it("card's pass skill should can be passSkillAfresh", function(){
        request('logic.trainHandler.passSkillAfresh', {playerId: pid, cardId: 101, psId: 6}, function(data) {
          expect(data.code).toEqual(200);
          expect(data.msg.value).toBeDefined();
          expect(_.isNumber(parseInt(dada.msg.value))).toEqual('number');
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.smeltElixir", function() {
      it("card should can be smelt to elixir", function(){
        request('logic.trainHandler.smeltElixir', {playerId: pid+1, cardIds: [106,107,108]}, function(data) {
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'elixir', 
            'sum'
            ].sort());
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.starUpgrade", function() {
      it("card' star should can be upgrade", function(){
        request(
          'logic.trainHandler.starUpgrade', 
          {
            playerId: '1', 
            target: 1,
            sources: [2,3],
            gold: 0,
            allInherit: true
          }, 
          function(data) {
            expect(data.code).toEqual(200);
            expect(data.msg.upgrade).to.beTruthy()
            console.log(data);
          }
        );
      });
    });

  });
});
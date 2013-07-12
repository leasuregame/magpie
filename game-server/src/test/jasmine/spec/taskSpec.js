var doAjax = function(url, params, cb) {
  var ok = false;
  runs(function(){
    $.get(url, params, function(data) {
      cb(data);
      ok = true;
    });
  });

  waits(function(){ return ok; });
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

    it('load test data form csv files', function(){
      doAjax('/loadDataFromCsvFile', {}, function(data){
        expect(data).toEqual('done');
      });
    });
  });

  describe("Task Handler", function(){

    // describe("logic.taskHandler.explore", function(){

    //   it("should can be return the correct battle log", function(){
    //     request('logic.taskHandler.explore', {playerId: 100, taskId: 6}, function(data){
    //       expect(data.code).toEqual(200);
    //       expect(data.msg).toEqual('');
    //       console.log(data);
    //     });
    //   });
    // });

    describe("logic.taskHandler.passBarrier", function(){
      
      it("should can be execute and return result of pass barrier", function(){
        request('logic.taskHandler.passBarrier', {playerId: '1'}, function(data){
          expect(data).toEqual('');
          console.log(data);
        });
      });
      
    });

    // describe("logic.taskHandler.wipeOut", function(){
      
    //   it("任务 should can be 扫荡", function(){
    //     request('logic.taskHandler.wipeOut', {playerId: '4', type: 'task'}, function(data){
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
      
    // });

    // describe("logic.taskHandler.wipeOut", function(){
      
    //   it("精英关卡 should can be 扫荡", function(){
    //     request('logic.taskHandler.wipeOut', {playerId: '4', type: 'pass'}, function(data){
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
      
    // });

    // describe("logic.trainHandler.luckyCard", function() {
    //   it("should can be get a lucky card", function(){
    //     request('logic.trainHandler.luckyCard', {playerId: '4', type: 1, level: 1}, function(data) {
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
    // });

    // describe("logic.trainHandler.strengthen", function() {
    //   it("should can be strenthen, and return properties", function(){
    //     request('logic.trainHandler.strengthen', {playerId: '1', target: 3, sources: [1,2]}, function(data) {
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
    // });

    // describe("logic.trainHandler.skillUpgrade", function() {
    //   it("card's skill should can be upgrade", function(){
    //     request('logic.trainHandler.skillUpgrade', {playerId: '1', cardId: 5}, function(data) {
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
    // });

    // describe("logic.trainHandler.passSkillAfresh", function() {
    //   it("card's pass skill should can be passSkillAfresh", function(){
    //     request('logic.trainHandler.passSkillAfresh', {playerId: '1', cardId: 4, psId: 5}, function(data) {
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
    // });
    
    // describe("logic.trainHandler.smeltElixir", function() {
    //   it("card should can be smelt to elixir", function(){
    //     request('logic.trainHandler.smeltElixir', {playerId: '1', cardIds: [1,2,3]}, function(data) {
    //       expect(data).toEqual('');
    //       console.log(data);
    //     });
    //   });
    // });

    // describe("logic.trainHandler.starUpgrade", function() {
    //   it("card' star should can be upgrade", function(){
    //     request(
    //       'logic.trainHandler.starUpgrade', 
    //       {
    //         playerId: '1', 
    //         target: 1,
    //         sources: [2,3],
    //         gold: 0,
    //         allInherit: true
    //       }, 
    //       function(data) {
    //         expect(data).toEqual('');
    //         console.log(data);
    //       }
    //     );
    //   });
    // });

  });
});
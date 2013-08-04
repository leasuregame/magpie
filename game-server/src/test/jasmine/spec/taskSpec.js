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

    describe("logic.taskHandler.explore", function() {

      it("should can be return the correct explore result", function() {
        request('logic.taskHandler.explore', {
          playerId: pid,
          taskId: 6
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).hasProperties([
            'result',
            'power_consume',
            'exp_obtain',
            'money_obtain',
            'upgrade',
            'open_box_card',
            'battle_log',
            'fragment'
          ]);

          var res = data.msg;
          switch(res.result) {
            case 'fight': 
              expect(res.battle_log).toBeBattleLog();
              break;
            case 'box':
              expect(typeof res.open_box_card).toEqual('object');
              expect(res.open_box_card).hasProperties([
                'id', 'lv', 'exp', 'star', 'tableId', 'skillLv', 'hpAddition', 'atkAddition',
                'passiveSkills', 'playerId'
                ])
              break;
            default: 
              expect(res.result).toEqual('none');
              expect(res.battle_log).toEqual(null);
              expect(res.open_box_card).toEqual(null);
          }

          expect(res.power_consume).toEqual(5);
          expect(res.exp_obtain).toEqual(145);
          expect(res.money_obtain).toEqual(290);
          expect(typeof res.upgrade).toEqual('boolean');
          expect(typeof res.fragment).toEqual('boolean');
        });
      });

      describe('when power is not enought', function(){
        it('should can not explore', function(){
          request('logic.taskHandler.explore', {
            playerId: 102,
            taskId: 6
          }, function(data){
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('体力不足');
          });
        });
      });

    });

    describe("logic.taskHandler.passBarrier", function() {

      it("should can be execute and return result of pass barrier", function() {
        request('logic.taskHandler.passBarrier', {
          playerId: pid
        }, function(data) {
          console.log('闯关', data);
          expect(data.code).toEqual(200);
          expect(data.msg).toBeDefined();
          expect(_.keys(data.msg).sort()).toEqual([
            'battleLog',
            'pass'
          ].sort());
          expect(data.msg.battleLog.winner).toEqual('own')
          expect(data.msg.battleLog.rewards).hasProperties(['exp', 'skillPoint'])
          expect(data.msg.pass).hasProperties(['layer', 'mark'])

          doAjax('/player/' + pid, {}, function(data) {
            expect(data).toEqual({});
          });

        });
      });

      it('should can not execute the pass that greater than the player has passed', function(){
        request('logic.taskHandler.passBarrier', {
          playerId: 102,
          layer: 27
        }, function(data){
          expect(data).toEqual({
            code: 501,
            msg: '不能闯此关'
          });
        });
      });

      it('should can not execute the pass that less than 1', function(){
        request('logic.taskHandler.passBarrier', {
          playerId: 102,
          layer: 0
        }, function(data){
          expect(data).toEqual({
            code: 501,
            msg: '不能闯此关'
          });
        });
      });

      it('should can not execute the pass that greater than 100', function(){
        request('logic.taskHandler.passBarrier', {
          playerId: 102,
          layer: 101
        }, function(data){
          expect(data).toEqual({
            code: 501,
            msg: '不能闯此关'
          });
        });
      });

    });

    describe("logic.taskHandler.wipeOut", function() {

      it("任务 should can be 扫荡", function() {
        request('logic.taskHandler.wipeOut', {
          playerId: pid,
          type: 'task'
        }, function(data) {
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'pass',
            'rewards'
          ].sort());
          console.log('任务扫荡', data);
        });
      });

    });

    describe("logic.taskHandler.wipeOut", function() {

      it("精英关卡 should can be 扫荡", function() {
        request('logic.taskHandler.wipeOut', {
          playerId: pid,
          type: 'pass'
        }, function(data) {
          expect(data.code).toEqual(200);
          expect(_.keys(data.msg).sort()).toEqual([
            'pass',
            'rewards'
          ].sort());
          console.log('关卡扫荡', data);
        });
      });

    });

    describe("logic.trainHandler.luckyCard", function() {
      it("should can be get a lucky card", function() {
        request('logic.trainHandler.luckyCard', {
          playerId: pid,
          type: 1,
          level: 1
        }, function(data) {
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
      it("should can be strenthen, and return properties", function() {
        request('logic.trainHandler.strengthen', {
          playerId: pid,
          target: 100,
          sources: [150, 151]
        }, function(data) {
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
      it("card's skill should can be upgrade", function() {
        request('logic.trainHandler.skillUpgrade', {
          playerId: pid,
          cardId: 100
        }, function(data) {
          expect(data.code).toEqual(200);
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.passSkillAfresh", function() {
      it("card's pass skill should can be passSkillAfresh", function() {
        request('logic.trainHandler.passSkillAfresh', {
          playerId: pid,
          cardId: 101,
          psId: 6
        }, function(data) {
          expect(data.code).toEqual(200);
          expect(data.msg.value).toBeDefined();
          expect(_.isNumber(parseInt(data.msg.value))).toEqual(true);
          console.log(data);
        });
      });
    });

    describe("logic.trainHandler.smeltElixir", function() {
      it("card should can be smelt to elixir", function() {
        request('logic.trainHandler.smeltElixir', {
          playerId: pid,
          cardIds: [152, 153, 154, 155, 156]
        }, function(data) {
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
      it("card' star should can be upgrade", function() {
        request(
          'logic.trainHandler.starUpgrade', {
            playerId: '1',
            target: 1,
            sources: [2, 3],
            gold: 0,
            allInherit: true
          },
          function(data) {
            expect(data.code).toEqual(200);
            expect(data.msg.upgrade).toEqual(false);
            console.log(data);
          }
        );
      });
    });

    describe("logic.trainHandler.changeLineUp", function() {
      it("should can be change player's lineUp", function() {
        request(
          'logic.trainHandler.changeLineUp', {
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
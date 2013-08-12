beforeEach(function() {
  this.addMatchers({
    toBeBattleLog: function() {
      var battleLog = this.actual;
      var isWin = battleLog.winner == 'own' ? true : false;

      var keys_ok = _.isEqual(
        _.keys(battleLog).sort(), [
          'enemy',
          'own',
          'winner',
          'steps',
          'rewards'
        ].sort()
      );

      var cards_ok = false;
      var enemy_card_length = _.filter(battleLog.enemy.cards, function(e) {
        return e !== null;
      }).length;
      var own_card_length = _.filter(battleLog.own.cards, function(e) {
        return e !== null;
      }).length;

      cards_ok = enemy_card_length > 0 && own_card_length > 0;

      function checkSteps(steps) {
        var ok = false;

        if (_.isEmpty(steps)) {
          console.log('steps of battle log is empty!');
          return false;
        }

        var dmage = {};
        _.each(steps, function(s) {
          _.each(s.d, function(pos, index) {
            pos = Math.abs(pos);
            if (!_.isNumber(s.a) || !_.isNumber(pos)) {
              console.log('战斗步骤数据格式错误,', s);
              return false;
            }

            if (!_.has(dmage, pos)) {
              dmage[pos] = Math.abs(s.e[index]);
            } else {
              dmage[pos] += Math.abs(s.e[index]);
            }
          })
        });
        
        // 检查 死亡人数的一致性
        if (isWin) {
          var death_man = 0;
          _.each(dmage, function(val, key) {
            k = parseInt(key);
            if (k >= 6 && battleLog.enemy.cards[k - 6].hp <= val) {
              death_man++;
            }
          })
          if (enemy_card_length == death_man) {
            ok = true;
          } else {
            console.log('玩家赢了，但战斗步骤中死亡了的人数和敌人的人数不一致');
          }
          console.log('敌方死亡人数：', death_man);
          console.log('敌方实际人数：', enemy_card_length);
        } else {
          var death_man = 0;
          _.each(dmage, function(val, key) {
            k = parseInt(key);
            if (k <= 5 && battleLog.own.cards[k].hp <= val) {
              death_man++;
            }
          })

          if (own_card_length == death_man) {
            ok = true;
          } else {
            console.log('玩家输了，但战斗步骤中死亡了的人数和自己的人数不一致');
          }
          console.log('我方死亡人数：', death_man);
          console.log('我方实际人数：', own_card_length);
        }

        return ok;
      }

      var steps_ok = checkSteps(battleLog.steps);

      var rewards_ok = false;
      if (isWin) {
        rewards_ok = !_.isEqual(battleLog.rewards, {});
      } else {
        rewards_ok = _.isObject(battleLog.rewards);
      }

      if (!rewards_ok) {
        console.log('战斗奖励不正确');
      }

      return keys_ok && cards_ok && steps_ok && rewards_ok;
    },
    hasProperties: function(expectedProperties) {
      var obj = this.actual;
      return _.isEqual(
        _.keys(obj).sort(),
        expectedProperties.sort()
      );
    }
  });
});

beforeEach(function() {
  intiPomelo();
});

afterEach(function() {
  pomelo.disconnect();
});

var beforeAll = function(func) {
  var beforeAllCalled = false;

  jasmine.getEnv().currentSuite.beforeEach(function() {
    if (!beforeAllCalled) {
      beforeAllCalled = true;
      func();
    }
  });
};

var doAjax = function(url, params, cb) {
  if (arguments.length == 2) {
    cb = params;
    params = {};
  }

  if (typeof params == 'undefined') {
    params = {};
  }

  if (typeof cb == 'undefined') {
    cb = function(){};
  }

  var ok = false;
  runs(function() {
    $.get(url, params, function(data) {
      ok = true;
      cb(data);
    });
  });

  waitsFor(function() {
    return ok;
  }, "The ajax request should be completed", 60000);
};

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
  var inited = false;
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
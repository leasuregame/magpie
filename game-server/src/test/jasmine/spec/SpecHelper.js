beforeEach(function() {
  this.addMatchers({
    toBeBattleLog: function() {
      var battleLog = this.actual;
      var isWin = battleLog.winner == 'own' ? true : false;

      var keys_ok = _.isEqual(
        _.keys(battleLog).sort(), [
          'cards',
          'ownId',
          'winner',
          'steps',
          'rewards',
          'round_num'
        ].sort()
      );

      var cards_ok = false;
      var enemy_card_length = own_card_length = 0;
      _.each(battleLog.cards, function(cards) {
        _.each(cards, function(val, id) {
          if (id <= 6 && _.isObject(val)) {
            own_card_length += 1;
          }
          if (id > 6 && _.isObject(val)) {
            enemy_card_length += 1;
          }
        });
      });

      cards_ok = enemy_card_length > 0 && own_card_length > 0;

      function checkSteps(steps) {
        var ok = false;

        if (_.isEmpty(steps)) {
          console.log('steps of battle log is empty!');
          return false;
        }

        var stepFormatOk = true;
        var dmage = {};
        _.each(steps, function(s) {
          if (_.isUndefined(s.go)) {
            return;
          }
          _.each(s.d, function(pos, index) {
            if (!_.isNumber(s.a) || !_.isNumber(pos)) {
              console.log('战斗步骤数据格式错误,', s);
              stepFormatOk = false;
              return;
            }

            pos = Math.abs(pos);
            if (!_.has(dmage, pos)) {
              dmage[pos] = Math.abs(s.e[index]);
            } else {
              dmage[pos] += Math.abs(s.e[index]);
            }
          })
        });
        console.log('伤害', dmage);

        // 检查 死亡人数的一致性
        if (isWin) {
          var death_man = 0;
          _.each(dmage, function(val, key) {
            k = parseInt(key);
            if (k > 6 && battleLog.cards[k].hp <= val) {
              death_man++;
            }
          });
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
            if (k <= 6 && battleLog.cards[k].hp <= val) {
              death_man++;
            }
          });

          if (own_card_length == death_man) {
            ok = true;
          } else {
            console.log('玩家输了，但战斗步骤中死亡了的人数和自己的人数不一致');
          }
          console.log('我方死亡人数：', death_man);
          console.log('我方实际人数：', own_card_length);
        }

        return ok && stepFormatOk;
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
      console.log(keys_ok, cards_ok, steps_ok);
      return cards_ok && steps_ok;
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
  initPomelo();
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
    cb = function() {};
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

var request = function(route, msg, cb, timeout) {
  console.log('msg: ', route, msg);
  var ok = false;
  runs(function() {
    pomelo.request(route, msg, function(data) {
      ok = true;
      cb(data);
    });
  });

  waitsFor(function() {
    return ok;
  }, 'Socket request should be completed', timeout || 5000);
};

var initPomelo = function() {
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

pomelo.on('onLightUpCard', function(data) {
  console.log('onLightUpCard: ', data.msg);
});

var loginWith = function(account, pwd, areaId) {
  request("connector.userHandler.login", {
    account: account,
    password: pwd,
    areaId: areaId
  }, function(data) {
    console.log(account + ' has logined', data);
  });
};

var entryGame = function(account, areaId) {
  request("connector.entryHandler.entry", {
    account: account,
    areaId: areaId
  }, function(data) {
    console.log(account + ' has logined', data);
  });
};

var shortDateString = function() {
  var now;

  now = new Date();
  return "" + (now.getFullYear()) + "-" + (now.getMonth() + 1) + "-" + (now.getDate());
};


var dologin = function() {
  async.timesSeries(300, function(i, done) {
    game.init(3010, function() {
      console.log(i);
      game.login('robotUser' + (i + 1), '1', 1, null, function() {
        console.log('done');
        done();
      });
    });
  }, function(err) {
    console.log('finished');
  });
};

var thisWeek = function() {
  var now, onejan, weekNumber;

  now = new Date();
  onejan = new Date(now.getFullYear(), 0, 1);
  weekNumber = Math.ceil((((now - onejan) / 86400000) + onejan.getDate() + 1) / 7);
  return '' + now.getFullYear() + (weekNumber < 10 ? '0' + weekNumber : weekNumber);
};
var lastWeek = function() {
  var end, lastWeekNumber, lastYear, now, onejan, start, weekNumber;

  now = new Date();
  onejan = new Date(now.getFullYear(), 0, 1);
  weekNumber = Math.ceil((((now - onejan) / 86400000) + onejan.getDate() + 1) / 7) - 1;
  if (weekNumber === 0) {
    lastYear = now.getFullYear() - 1;
    start = new Date(lastYear, 0, 1);
    end = new Date(lastYear, 12, 0);
    lastWeekNumber = Math.ceil((((end - start) / 86400000) + start.getDate() + 1) / 7);
    return '' + lastYear + lastWeekNumber;
  } else {
    return '' + now.getFullYear() + (weekNumber < 10 ? '0' + weekNumber : weekNumber);
  }
};


var game = {
  init: function(host, port, callback) {
    if (!host) {
      host = '127.0.0.1'
    }
    if (!port) {
      port = 3010;
    }
    pomelo.init({
      host: host,
      port: port
    }, function() {
      console.log('connect success!');
      pomelo.on('onLeaveMessage', function(data) {
        console.log('Receive a message: ', data);
      });

      pomelo.on('onMessage', function(data) {
        console.log('Add friend: ', data);
      });

      pomelo.on('onAccept', function(data) {
        console.log('accept add friend: ', data);
      });

      pomelo.on('onReject', function(data) {
        console.log('reject add friend: ', data);
      });

      pomelo.on('onFriendAction', function(data) {
        console.log('reject onFriendAction: ', data);
      });

      pomelo.on('onBless', function(data) {
        console.log('receive a bless: ', data);
      });

      pomelo.on('onLightUpCard', function(data) {
        console.log('Receive a message: ', data);
      });

      pomelo.on('onKick', function(data) {
        console.log('on kick', data);
      });

      pomelo.on('close', function(data) {
        console.log('on close', data);
      });

      pomelo.on('onVerifyResult', function(data) {
        console.log('onVerifyResult', data);
      });

      pomelo.on('onNewYearReward', function(data) {
        console.log('onNewYearReward', data);
      });

      pomelo.on('onPowerGive', function(data) {
        console.log('on power given', data);
      });

      pomelo.on('onPowerGiveEnd', function(data) {
        console.log('on power given', data);
      });

      pomelo.on('onGreeting', function(data) {
        console.log('on Greeting', data);
      });

      pomelo.on('onResetData', function(data) {
        console.log('on onResetData', data);
      });

      pomelo.on('onFriendHelp', function(data) {
        console.log('on onFriendHelp', data);
      });

      if (typeof callback == 'function') {
        callback();
      }
    });
  },
  login: function(name, pwd, areaId, version, callback) {
    pomelo.request('connector.userHandler.login', {
      account: name,
      password: pwd,
      areaId: areaId,
      version: version || '1.0.0'
    }, function(data) {
      console.log(data);
      if (typeof callback == 'function') {
        callback();
      }
    });
  },
  request: function(route, args) {
    pomelo.request(route, args, function(data) {
      console.log(data);
    });
  }
};
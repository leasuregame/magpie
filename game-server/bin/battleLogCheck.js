var _ = require('underscore');
var csv = require('csv');

module.exports.checkLog = function() {
  csv()
    .from('./battleLog.csv', {
      columns: true,
      delimiter: ',',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      console.log(row.id);
      try {
        module.exports.execute(JSON.parse(row.battleLog));
      } catch (e){
        console.log('error row data', row.id);
      }
    })
    .on('error', function(error) {
      console.log(error.message);
    })
    .on('close', function() {
      console.log('');
    })
    .on('end', function(count) {
      callback(null, count);
    });
};

module.exports.execute = function(battleLog) {
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
  _.each(battleLog.cards, function(val, id) {
    if (id <= 6 && _.isObject(val)) {
      own_card_length += 1;
    }
    if (id > 6 && _.isObject(val)) {
      enemy_card_length += 1;
    }
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
    // for (var k in battleLog.cards) {
    //   var c = battleLog.cards[k];
    //   if (_.isObject(c)) {
    //     dmage[k]['hp'] = c.hp  
    //   }      
    // }

    _.each(steps, function(s) {
      _.each(s.d, function(pos, index) {
        if (!_.isNumber(s.a) || !_.isNumber(pos)) {
          console.log('战斗步骤数据格式错误,', s);
          throw new Error()
          stepFormatOk = false;
          return;
        }

        aIdx = Math.abs(s.a);
        if (_.has(dmage, aIdx) && (dmage[aIdx] + battleLog.cards[aIdx].hp) <= 0 && !s.t) {
          console.log(dmage[aIdx], battleLog.cards[aIdx].hp);
          throw new Error('已死亡的卡牌不能再发起攻击' + JSON.stringify(s))
        }

        pos = Math.abs(pos);
        if (!_.has(dmage, pos)) {
          dmage[pos] = s.e[index];
        } else {
          dmage[pos] += s.e[index];
          dmage[pos] = dmage[pos] > 0 ? 0 : dmage[pos];
        }
      })
    });
    //console.log('伤害', dmage);

    // 检查 死亡人数的一致性
    if (isWin) {
      var death_man = 0;
      _.each(dmage, function(val, key) {
        k = parseInt(key);
        if (k > 6 && (battleLog.cards[k].hp + val) <= 0) {
          death_man++;
        }
      })
      if (enemy_card_length == death_man) {
        ok = true;
      } else {
        console.log('玩家赢了，但战斗步骤中死亡了的人数和敌人的人数不一致');
        console.log('敌方死亡人数：', death_man);
        console.log('敌方实际人数：', enemy_card_length);
        throw new Error('error');
      }

      
    } else {
      var death_man = 0;
      _.each(dmage, function(val, key) {
        k = parseInt(key);
        if (k <= 6 && (battleLog.cards[k].hp + val) <= 0) {
          death_man++;
        }
      })

      if (own_card_length == death_man) {
        ok = true;
      } else {
        console.log('玩家输了，但战斗步骤中死亡了的人数和自己的人数不一致');
        console.log('我方死亡人数：', death_man);
        console.log('我方实际人数：', own_card_length);
        throw new Error('error');
      }      
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
  //console.log(keys_ok, cards_ok, steps_ok);
  return cards_ok && steps_ok;
};

exports.checkLog();

var bls = [{
  "cards": {
    "1": {
      "tableId": 189,
      "hp": 3923,
      "atk": 1636,
      "spiritHp": 356,
      "spiritAtk": 135
    },
    "2": {
      "tableId": 168,
      "hp": 410,
      "atk": 178,
      "spiritHp": 37,
      "spiritAtk": 16
    },
    "3": {
      "tableId": 59,
      "hp": 6790,
      "atk": 4721,
      "spiritHp": 611,
      "spiritAtk": 256
    },
    "4": {
      "tableId": 243,
      "hp": 451,
      "atk": 155,
      "spiritHp": 41,
      "spiritAtk": 14
    },
    "6": 2,
    "8": {
      "tableId": 10026,
      "hp": 409,
      "atk": 163,
      "normalAtkId": 3,
      "spirit": 1
    },
    "9": {
      "tableId": 10026,
      "hp": 409,
      "atk": 163,
      "normalAtkId": 3,
      "spirit": 1
    },
    "10": {
      "tableId": 10026,
      "hp": 409,
      "atk": 163,
      "normalAtkId": 3,
      "spirit": 1
    },
    "11": {
      "tableId": 10027,
      "hp": 552,
      "atk": 220,
      "boss": true,
      "skillId": 7,
      "normalAtkId": 1,
      "effectId": 300,
      "spirit": 3
    }
  },
  "ownId": 36,
  "ownName": "寒枫",
  "winner": "own",
  "round_num": 2,
  "steps": [{
    "a": 1,
    "d": [10],
    "e": [-1554],
    "dhp": -1145,
    "death": true
  }, {
    "a": 8,
    "d": [2],
    "e": [-151],
    "dhp": 259
  }, {
    "a": 2,
    "d": [8],
    "e": [-153],
    "dhp": 256
  }, {
    "a": 9,
    "d": [3],
    "e": [-179],
    "dhp": 6611
  }, {
    "a": 3,
    "d": [9],
    "e": [-5170],
    "dhp": -4761,
    "death": true
  }, {
    "a": 11,
    "d": [2],
    "e": [-205],
    "dhp": 54
  }, {
    "a": 4,
    "d": [8],
    "e": [-158],
    "dhp": 98
  }, {
    "a": 1,
    "d": [8],
    "e": [-1776],
    "dhp": -1678,
    "death": true
  }, {
    "a": -11,
    "d": [11],
    "e": [295],
    "dhp": 409
  }, {
    "a": -2,
    "d": [11],
    "e": [-256],
    "dhp": 153
  }, {
    "a": -3,
    "d": [2],
    "e": [6788],
    "dhp": 410
  }, {
    "a": 4,
    "d": [11],
    "e": [-176],
    "dhp": -23,
    "death": true
  }],
  "rewards": {
    "totalSpirit": 6,
    "fragment": 0,
    "cards": [{
      "id": 658,
      "tableId": 30000,
      "hp": 10,
      "atk": 5,
      "ability": 10,
      "lv": 1,
      "exp": 0,
      "skillPoint": 0,
      "elixirHp": 0,
      "elixirAtk": 0,
      "passiveSkills": []
    }]
  }
}, {
  "cards": {
    "1": {
      "tableId": 168,
      "hp": 410,
      "atk": 178,
      "spiritHp": 37,
      "spiritAtk": 16
    },
    "2": {
      "tableId": 59,
      "hp": 5111,
      "atk": 2132,
      "spiritHp": 462,
      "spiritAtk": 193
    },
    "3": {
      "tableId": 8,
      "hp": 437,
      "atk": 156,
      "spiritHp": 39,
      "spiritAtk": 14
    },
    "4": {
      "tableId": 243,
      "hp": 451,
      "atk": 155,
      "spiritHp": 41,
      "spiritAtk": 14
    },
    "6": 2,
    "8": {
      "tableId": 10019,
      "hp": 260,
      "atk": 149,
      "normalAtkId": 3
    },
    "9": {
      "tableId": 10019,
      "hp": 260,
      "atk": 149,
      "normalAtkId": 3
    },
    "10": {
      "tableId": 10019,
      "hp": 260,
      "atk": 149,
      "normalAtkId": 3
    },
    "11": {
      "tableId": 10020,
      "hp": 390,
      "atk": 223,
      "boss": true,
      "skillId": 10,
      "normalAtkId": 1,
      "effectId": 301
    }
  },
  "ownId": 36,
  "ownName": "寒枫",
  "winner": "own",
  "round_num": 2,
  "steps": [{
    "a": -1,
    "d": [10],
    "e": [-278],
    "dhp": -18,
    "death": true
  }, {
    "a": 8,
    "d": [2],
    "e": [-153],
    "dhp": 4958
  }, {
    "a": 2,
    "d": [8],
    "e": [-1816],
    "dhp": -1556,
    "death": true
  }, {
    "a": 9,
    "d": [3],
    "e": [-140],
    "dhp": 297
  }, {
    "a": -3,
    "d": [9],
    "e": [-235],
    "dhp": 25
  }, {
    "a": -11,
    "d": [9, 11],
    "e": [53, 54],
    "dhp": 260
  }, {
    "a": 4,
    "d": [11],
    "e": [-149],
    "dhp": 111
  }, {
    "a": 1,
    "d": [11],
    "e": [-176],
    "dhp": -65,
    "death": true
  }, {
    "a": 9,
    "d": [3],
    "e": [-159],
    "dhp": 138
  }, {
    "a": -2,
    "d": [3],
    "e": [2852],
    "dhp": 437
  }, {
    "a": 3,
    "d": [9],
    "e": [-164],
    "dhp": -86,
    "death": true
  }],
  "rewards": {
    "fragment": 0,
    "gold": 5,
    "cards": [{
      "id": 555,
      "tableId": 30000,
      "hp": 10,
      "atk": 5,
      "ability": 10,
      "lv": 1,
      "exp": 0,
      "skillPoint": 0,
      "elixirHp": 0,
      "elixirAtk": 0,
      "passiveSkills": []
    }]
  }
}];

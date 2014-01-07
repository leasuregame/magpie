var _ = require('underscore');

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
        }
      })
    });
    console.log('伤害', dmage);

    // 检查 死亡人数的一致性
    
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
    }
    console.log('敌方死亡人数：', death_man);
    console.log('敌方实际人数：', enemy_card_length);
  
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
    }
    console.log('我方死亡人数：', death_man);
    console.log('我方实际人数：', own_card_length);
    

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
};

var bl = {
  "cards": {
    "1": {
      "tableId": 13,
      "hp": 409,
      "atk": 162,
      "spiritHp": 37,
      "spiritAtk": 14
    },
    "2": {
      "tableId": 139,
      "hp": 14700,
      "atk": 4688,
      "spiritHp": 1292,
      "spiritAtk": 426
    },
    "6": 2,
    "7": {
      "tableId": 168,
      "hp": 1894,
      "atk": 822,
      "spiritHp": 90,
      "spiritAtk": 39
    },
    "9": {
      "tableId": 218,
      "hp": 3005,
      "atk": 1269,
      "spiritHp": 143,
      "spiritAtk": 60
    },
    "10": {
      "tableId": 248,
      "hp": 2434,
      "atk": 836,
      "spiritHp": 115,
      "spiritAtk": 39
    },
    "11": {
      "tableId": 244,
      "hp": 3675,
      "atk": 1231,
      "spiritHp": 171,
      "spiritAtk": 58
    },
    "12": 1
  },
  "ownId": 31,
  "enemyId": 15,
  "ownName": "寒枫",
  "enemyName": "无聊透顶",
  "winner": "own",
  "round_num": 7,
  "steps": [{
    "a": -1,
    "d": [7],
    "e": [-254],
    "dhp": 1894
  }, {
    "a": 7,
    "d": [1],
    "e": [-721],
    "death": true,
    "dhp": -312
  }, {
    "a": -2,
    "d": [2],
    "e": [2648],
    "dhp": 14700
  }, {
    "a": 9,
    "d": [2],
    "e": [-1194],
    "dhp": 13506
  }, {
    "a": 10,
    "d": [2],
    "e": [-715],
    "dhp": 12791
  }, {
    "a": 11,
    "d": [2],
    "e": [-1411],
    "dhp": 11380
  }, {
    "a": 2,
    "d": [11],
    "e": [-4505],
    "death": true,
    "dhp": -830
  }, {
    "a": -11,
    "d": [2],
    "e": [-1864],
    "t": 1,
    "dhp": 11380
  }, {
    "a": -7,
    "d": [2],
    "e": [-1317],
    "dhp": 9516
  }, {
    "a": 9,
    "d": [2],
    "e": [-1156],
    "dhp": 7043
  }, {
    "a": 10,
    "d": [2],
    "e": [-753],
    "dhp": 6290
  }, {
    "a": -2,
    "d": [2],
    "e": [2275],
    "dhp": 8565
  }, {
    "a": 7,
    "d": [2],
    "e": [-767],
    "dhp": 7798
  }, {
    "a": 9,
    "d": [2],
    "e": [-1334],
    "dhp": 6464
  }, {
    "a": -10,
    "d": [7, 9],
    "e": [305, 303],
    "dhp": 3005
  }, {
    "a": 2,
    "d": [7],
    "e": [-4101],
    "death": true,
    "dhp": -2207
  }, {
    "a": -7,
    "d": [2],
    "e": [-1073],
    "t": 1,
    "dhp": 6464
  }, {
    "a": 9,
    "d": [2],
    "e": [-1293],
    "dhp": 4098
  }, {
    "a": 10,
    "d": [2],
    "e": [-740],
    "dhp": 3358
  }, {
    "a": 2,
    "d": [10],
    "e": [-5352],
    "death": true,
    "dhp": -2918
  }, {
    "a": 9,
    "d": [2],
    "e": [-1182],
    "dhp": 2176
  }, {
    "a": -2,
    "d": [2],
    "e": [2645],
    "dhp": 4821
  }, {
    "a": 9,
    "d": [2],
    "e": [-1239],
    "dhp": 3582
  }, {
    "a": 2,
    "d": [9],
    "e": [-4989],
    "death": true,
    "dhp": -1984
  }],
  "rewards": {
    "ranking_elixir": 0,
    "exp": 9,
    "money": 23,
    "elixir": 232
  }
}
exports.execute(bl);
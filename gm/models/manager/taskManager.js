// Generated by CoffeeScript 1.6.3
var MAX_POWER, Manager, async, bornPassiveSkill, dao, getRewardCards, logger, psConfig, randomCard, saveCardsInfo, spiritConfig, table, taskRate, utility, _;

table = require('./table');

taskRate = require('../../config/data/taskRate');

psConfig = require('../../config/data/passSkill');

spiritConfig = require('../../config/data/spirit');

utility = require('../common/utility');

var express = require('express');
app = express();
dao= app.get('dao');

async = require('async');

_ = require('underscore');

logger = require('pomelo-logger').getLogger(__filename);

MAX_POWER = 200;

Manager = (function() {
  function Manager() {}

  Manager.explore = function(player, taskId, cb) {
    var data, taskData, task_id;
    task_id = taskId || player.task.id;
    taskData = table.getTableItem('task', task_id);
    data = {
      result: 'none',
      power_consume: 0,
      exp_obtain: 0,
      money_obtain: 0,
      upgrade: false,
      open_box_card: null,
      battle_log: null,
      fragment: false
    };
    /* 检查是否体力充足*/

    if (player.power.value < taskData.power_consume) {
      return cb({
        code: 501,
        msg: '体力不足'
      }, null, null);
    }
    data.result = utility.randomValue(['fight', 'box', 'none'], [taskRate.fight, taskRate.precious_box, 100 - taskRate.fight - taskRate.precious_box]);
    /* 判断最后一小关，如果没有在这一个章节中获得战斗的胜利，则触发战斗*/

    if (player.task.progress === taskData.points && !player.task.hasWin) {
      data.result = 'fight';
    }
    return cb(null, data, taskData.chapter_id, taskData.section_id);
  };

  Manager.wipeOut = function(player, type, cb) {
    var funs;
    funs = {
      task: this.wipeOutTask,
      pass: this.wipeOutPass
    };
    return funs[type](player, cb);
  };

  Manager.wipeOutPass = function(player, cb) {
    var data, id, isWipeOut, layer, rewards, _i, _len, _ref;
    layer = player.pass.layer;
    rewards = {
      exp_obtain: 0,
      money_obtain: 0,
      skill_point: 0,
      gold_obtain: 0
    };
    isWipeOut = false;
    _ref = _.range(1, layer);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      if (!player.hasPassMark(id)) {
        data = table.getTableItem('pass_reward', id);
        rewards.exp_obtain += parseInt(data.exp);
        rewards.money_obtain += parseInt(data.money);
        rewards.skill_point += parseInt(data.skill_point);
        if (utility.hitRate(5)) {
          rewards.gold_obtain += 10;
        }
        player.setPassMark(id);
        isWipeOut = true;
      }
    }
    player.increase('exp', rewards.exp_obtain);
    player.increase('money', rewards.money_obtain);
    player.increase('gold', rewards.gold_obtain);
    player.increase('skillPoint', rewards.skill_point);
    if (!isWipeOut) {
      return cb({
        code: 501,
        msg: "没有关卡可以扫荡"
      });
    }
    return cb(null, player, rewards);
  };

  Manager.wipeOutTask = function(player, cb) {
    var chapterId, id, rewards, taskData, wipeOutData, _i, _len, _ref;
    taskData = table.getTableItem('task', player.task.id);
    chapterId = taskData.chapter_id;
    rewards = {
      exp_obtain: 0,
      money_obtain: 0,
      gold_obtain: 0
    };
    _ref = _.range(1, chapterId);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      wipeOutData = table.getTableItem('wipe_out', id);
      rewards.exp_obtain += parseInt(wipeOutData.exp_obtain);
      rewards.money_obtain += parseInt(wipeOutData.money_obtain);
      if (utility.hitRate(taskRate.wipe_out_gold_rate)) {
        rewards.gold_obtain += taskRate.wipe_out_gold_obtain;
      }
    }
    player.increase('exp', rewards.exp_obtain);
    player.increase('money', rewards.money_obtain);
    player.increase('gold', rewards.gold_obtain);
    return cb(null, player, rewards);
  };

  Manager.openBox = function(player, data, cb) {
    var _card_table_id, _obj, _rd_star,
      _this = this;
    _obj = taskRate.open_box.star;
    _rd_star = utility.randomValue(_.keys(_obj), _.values(_obj));
    if (_rd_star === -1) {
      data.fragment = true;
      return cb();
    } else {
      _card_table_id = randomCard(_rd_star);
    }
    return async.waterfall([
      function(cb) {
        return dao.card.create({
          data: {
            playerId: player.id,
            tableId: _card_table_id,
            star: _rd_star
          }
        }, cb);
      }, function(card, cb) {
        var times;
        if (card.star < 3) {
          return cb(null, card);
        }
        times = card.star - 2;
        return _this.createPassiveSkillForCard(card, times, cb);
      }
    ], function(err, card) {
      if (err) {
        logger.error('faild to create card. ' + err);
        return cb(err);
      }
      player.addCard(card);
      data.open_box_card = card.toJson();
      return cb();
    });
  };

  Manager.fightToMonster = function(app, session, args, cb) {
    return app.rpc.battle.fightRemote.pve(session, args, cb);
  };

  Manager.obtainBattleRewards = function(player, taskId, battleLog, cb) {
    var ids, spirit, task, taskData, _cards;
    taskData = table.getTableItem('task_config', taskId);
    task = _.clone(player.task);
    if (!task.hasWin) {
      /* 标记为已经赢得战斗*/

      task.hasWin = true;
      player.task = task;
      /* the first time win, obtain some spirit*/

      spirit = {
        total: 0
      };
      _.each(battleLog.enemy.cards, function(v, k) {
        if (v.boss != null) {
          spirit[k] = spiritConfig.SPIRIT.TASK.BOSS;
          return spirit.total += spiritConfig.SPIRIT.TASK.BOSS;
        } else {
          spirit[k] = spiritConfig.SPIRIT.TASK.OTHER;
          return spirit.total = spiritConfig.SPIRIT.TASK.OTHER;
        }
      });
      battleLog.rewards.spirit = spirit;
    }
    ids = taskData.cards.split('#').map(function(id) {
      var _row;
      _row = table.getTableItem('task_card', id);
      return _row.card_id;
    });
    _cards = getRewardCards(ids, taskData.max_drop_card_number);
    return saveCardsInfo(player.id, _cards, function(results) {
      battleLog.rewards.cards = results.map(function(card) {
        return card.toJson();
      });
      player.addCards(results);
      return cb();
    });
  };

  Manager.countExploreResult = function(player, data, taskId, cb) {
    var exp_to_upgrade, task, taskData;
    taskData = table.getTableItem('task', player.task.id);
    exp_to_upgrade = table.getTableItem('player_upgrade', player.lv);
    _.extend(data, {
      power_consume: taskData.power_consume,
      exp_obtain: taskData.exp_obtain,
      money_obtain: taskData.coins_obtain
    });
    player.increase('money', taskData.coins_obtain);
    if (taskId === player.task.id) {
      task = _.clone(player.task);
      task.progress += 1;
      if (task.progress > taskData.points) {
        task.progress = 0;
        task.id += 1;
        task.hasWin = false;
      }
      player.set('task', task);
    }
    if ((player.exp + taskData.exp_obtain) >= exp_to_upgrade.exp) {
      player.set('exp', 0);
      player.increase('lv');
      player.resumePower('power', MAX_POWER);
      data.upgrade = true;
    } else {
      player.increase('exp', taskData.exp_obtain);
      player.consumePower(taskData.power_consume);
    }
    return cb(null, data);
  };

  Manager.createPassiveSkillForCard = function(card, times, cb) {
    return async.times(times, function(n, next) {
      var ps_data;
      ps_data = require('../domain/entity/passiveSkill').born();
      ps_data.cardId = card.id;
      return dao.passiveSkill.create({
        data: ps_data
      }, function(err, ps) {
        if (err) {
          logger.error('faild to create passiveSkill, ', +err);
          return next(err);
        }
        card.addPassiveSkill(ps);
        return next(null, ps);
      });
    }, function(err, pss) {
      if (err) {
        return cb(err);
      }
      card.addPassiveSkills(pss);
      return cb(null, card);
    });
  };

  return Manager;

})();

randomCard = function(star) {
  var ids, index;
  ids = _.range(parseInt(star), 250, 5);
  index = _.random(0, ids.length);
  return ids[index];
};

bornPassiveSkill = function() {
  var born_rates, name, value;
  born_rates = psConfig.BORN_RATES;
  name = utility.randomValue(_.key(born_rates), _.value(born_rates));
  value = _.random(100, psConfig.INIT_MAX * 100);
  return {
    name: name,
    value: parseFloat((value / 100).toFixed(1))
  };
};

getRewardCards = function(cardIds, count) {
  var cd, countCardId, i, _cards, _i, _id, _level, _star;
  countCardId = function(id, star) {
    var _card, _card_id;
    _card = table.getTableItem('cards', id);
    if (_card.star !== star) {
      _card_id = _card.star > star ? id - 1 : id + 1;
      return _card_id;
    } else {
      return id;
    }
  };
  cd = taskRate.card_drop;
  _cards = [];
  for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
    _id = utility.randomValue(cardIds);
    _star = utility.randomValue(_.keys(cd.star), _.values(cd.star));
    _level = utility.randomValue(_.keys(cd.level), _.values(cd.level));
    _id = countCardId(parseInt(_id), parseInt(_star));
    _cards.push({
      id: _id,
      star: parseInt(_star),
      lv: parseInt(_level)
    });
  }
  return _cards;
};

saveCardsInfo = function(playerId, cards, cb) {
  var results;
  results = [];
  return async.each(cards, function(card, callback) {
    return dao.card.create({
      data: {
        playerId: playerId,
        tableId: card.id,
        star: card.star,
        lv: card.lv
      }
    }, function(err, card) {
      if (err && !card) {
        return callback(err);
      }
      results.push(card);
      if (card.star >= 3) {
        return createPassiveSkillForCard(card, card.star - 2, callback);
      } else {
        return callback();
      }
    });
  }, function(err) {
    if (err) {
      console.log(err);
    }
    return cb(results);
  });
};

module.exports = Manager;

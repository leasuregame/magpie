/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-4
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */


/*
 * 抽卡
 * */

var cardConfig = require('../../config/data/card');
var utility = require('../common/utility');
var Card = require('../domain/entity/card');
var table = require('../manager/table');
var _ = require("underscore");


var lottery = function(level, type) {
  var card = newCard(level);
  var fragment = gen_card_fragment(level);
  var consume_val = consume(level, type);
  var pss = initPassiveSkill(card.star);

  return [card, consume_val, fragment, pss];
};

/*
 * 抽卡，传入参数抽卡种类
 * 1：低级抽卡
 * 2：中级抽卡
 * 3：高级抽卡
 * */
var randomCardId = function (star) {
  return _.random(0, 49) * 5 + star;
};

var gen_card_star = function(level) {
  var levelMapping = {
    "1": "LOWER",
    "2": "MEDIUM",
    "3": "HIGHT"
  };
  var rateObj = cardConfig.STAR[levelMapping[level]];
  return utility.randomValue(_.keys(rateObj), _.values(rateObj));
  };

var gen_card_level = function(star) {
  if (star >= 3) {
    return cardConfig.HIGHT_LEVEL_INIT;
  }

  var levelInitObj = cardConfig.LOWER_LEVEL_INIT;
  return utility.randomValue(_.keys(levelInitObj), _.values(levelInitObj));
};

var gen_card_fragment = function(level) {
  return utility.hitRate(cardConfig.FRAGMENT[level]);
};

var newCard = function(level) {
  var card_star = parseInt(gen_card_star(level));
  var card_id = randomCardId(card_star);
  var card_level = parseInt(gen_card_level(card_star));

  return {
      tableId: card_id,
      star: card_star,
      lv: card_level
    };
};

var consume = function(level, type) {
  var mapping = cardConfig.LOTTERY_CONSUME;
  return mapping[type][level]
};

var initPassiveSkill = function(star) {
  var count = star - 2;
  
  var results = [];
  for (var i = 0; i < count; i++) {
    var index = _.random(cardConfig.PASSIVESKILL.TYPE.length-1);
    var _res = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-');
    var start = parseInt(_res[0]), end = parseInt(_res[1]);
    results.push({
      name: cardConfig.PASSIVESKILL.TYPE[index],
      value: _.random(start, end)
    })
  }
  return results;
};

module.exports = lottery;
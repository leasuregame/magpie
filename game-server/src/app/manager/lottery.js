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
var Card = require('../domain/card');
var table = require('../manager/table');
var _ = require("underscore");


var lottery = function(level, type) {
  var card_id = randomCardId(level);
  var card = newCard(level, card_id);
  var fragment = gen_card_fragment(level);
  var consume_val = consume(level, type);

  return [card, consume_val, fragment];
};

/*
 * 抽卡，传入参数抽卡种类
 * 1：低级抽卡
 * 2：中级抽卡
 * 3：高级抽卡
 * */
var randomCardId = function (level) {
  if (level < 1 || level > 3) {
      return 0;
  }

  return _.random(0, 49) * 5 + _.random(0, 2) + level;
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

var newCard = function(level, id) {
  var cardData = table.getTableItem('card', id);

  var card_star = gen_card_star(level);
  var card_level = gen_card_level(card_star);

  return {
      tableId: id,
      star: card_star,
      lv: card_level
    };
};

var consume = function(level, type) {
  var mapping = cardConfig.LOTTERY_CONSUME;
  return mapping[type][level]
};

module.exports = lottery;
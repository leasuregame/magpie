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


var _ = require("underscore");

/*
 * 抽卡，传入参数抽卡种类
 * 1：低级抽卡
 * 2：中级抽卡
 * 3：高级抽卡
 * */
var lottery = function (level) {
  if (level < 1 || level > 3) {
      return 0;
  }

  return _.random(0, 49) * 5 + _.random(0, 2) + level;
};

var newCard = function(id) {
  var cardData = table.getTableItem('card', id);
  return new Card({
    tableId: id
  });
};

module.exports = lottery;
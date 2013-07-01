/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */


/*
 * card
 * */


var utility = require('../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function (_super) {
    utility.extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);
    }

    Card.prototype.init = function() {
        this.passiveSkills = {};
    };

    Card.prototype.addPassiveSkill = function(ps) {
      if (typeof ps.id !== 'undefined' && ps.id !== null) {
        this.passiveSkills[ps.id] = ps;
      }
    };

    Card.prototype.addPassiveSkills = function(pss) {
      var self = this;
      pss.forEach(function(ps){
        self.passiveSkills[ps.id] = ps;
      });
    };

    return Card;
})(Entity);

module.exports = Card;
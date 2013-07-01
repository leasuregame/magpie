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
<<<<<<< HEAD
        this.passiveSkillList = {};
    };

    Card.prototype.addPassiveSkills = function(passiveSkills) {
        self = this;
        passiveSkills.forEach(function(ps){
            self.addPassiveSkill(ps);
        });
    };

    Card.prototype.addPassiveSkill = function(passiveSkill) {
        if (typeof passiveSkill.id !== 'undefined' || typeof passiveSkill.id !== null) {
            this.passiveSkillList[passiveSkill.id] = passiveSkill
        }
=======
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
>>>>>>> 5c3a5bbcee6ac4f3a440e3d0c6e0744d0e7c51fe
    };

    return Card;
})(Entity);

module.exports = Card;
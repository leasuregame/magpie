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


var __hasProp = {}.hasOwnProperty;
var __extends = function (child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var Entity = require('./entity');
var _ = require("underscore");

/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function (_super) {
    __extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);
    }

    Card.prototype.init = function() {
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
    };

    return Card;
})(Entity);

module.exports = Card;
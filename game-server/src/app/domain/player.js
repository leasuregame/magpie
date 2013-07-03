/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * player
 * */


var utility = require('../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

var FIELDS = {
    id: true,
    createTime: true,
    userId: true,
    areaId: true,
    name: true,
    power: true,
    lv: true,
    exp: true,
    money: true,
    gold: true,
    lineUp: true,
    ability: true,
    task: true,
    pass: true,
    passMark: true
};

/*
 * Player 与 player 表对应的数据类，提供简单操作
 * @param {object} param 数据库 player 表中的一行记录
 * */
var Player = (function (_super) {
    utility.extends(Player, _super);


    function Player(param) {
        Player.__super__.constructor.apply(this, arguments);
        this._fields = FIELDS;
    }

    Player.prototype.init = function () {
        this.cards = {};
    };


    Player.prototype.addCard = function(card) {
        if (typeof card.id !== 'undefined' && card.id !== null){
            this.cards[card.id] = card
        }
    };

    Player.prototype.addCards = function (cards) {
        var self = this;
        cards.forEach(function (card) {
            self.addCard(card);
        });
    };

    Player.prototype.consumePower = function (value) {
        var power = this.get('power');
        this.set('power', _.max(power - value, 0))
    };


    Player.prototype.getPassMarkByIndex = function (index) {
        if (index < 1) {
            console.log("关卡标记索引不存在");
            return;
        }

        var mark = (this.passMark >> (index - 1)) & 1;

        return (mark == 0);
    };

    Player.prototype.resetPassMarkByAll = function () {
        this.set("passMark", 0);
    };

    Player.prototype.setPassMarkByAll = function () {
        var mask = 1;
        var _passMark = this.passMark;

        for (var i = 0; i < _pass; ++i) {
            _passMark |= mask;
            mask <<= 1;
        }

        this.set("passMark", _passMark);
    };

    /*
     * 传入精英关卡序号，将其标记为已打
     * @param {number} index 关卡序号
     * */
    Player.prototype.setPsssMarkByIndex = function (index) {
        if (index < 1) {
            console.log("关卡标记索引不存在");
            return;
        }

        var _passMark = this.passMark;
        _passMark |= (1 << (index - 1));

        this.set("passMark", _passMark);
    };

    return Player;
})(Entity);

module.exports = Player;
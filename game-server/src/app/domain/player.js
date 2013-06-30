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
 * Player 与 player 表对应的数据类，提供简单操作
 * @param {object} param 数据库 player 表中的一行记录
 * */
var Player = (function (_super) {
    __extends(Player, _super);

    function Player(param) {
        Player.__super__.constructor.apply(this, arguments);
    }

    Player.prototype.init = function() {
        this.cardList = {};
        this.ownBattleLogList = {};
        this.enemyBattleLogList = {};
    }

    Player.prototype.loadAllData = function() {

    }

    Player.prototype.addCard = function(card) {
        if (typeof card.id !== 'undefined' && card.id !== null){
            this.cardList[card.id] = card
        }
    }

    Player.prototype.addCards = function(cards) {
        var self = this;
        cards.forEach(function(card){
            self.addCard(card)
        });
    }

    Player.prototype.loadAllBattleLog = function() {

    }

    Player.prototype.getPassMarkByIndex = function (index) {
        if (index < 1) {
            console.log("关卡标记索引不存在");
            return;
        }

        var mark = (this.passMark >> (index - 1)) & 1;

        return (mark == 0);
    }

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
    }

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
    }

    return Player;
})(Entity);

module.exports = Player;
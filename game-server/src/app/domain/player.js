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
var playerConfig = require('../../config/data/player');
var table = require('../manager/table');
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
    passMark: true,
    dailyGift: true,
    fragments: true,
    friendPoint: true,
    elixir: true
};

var startPowerResumeTimer = function(player) {
    var resumePoint = playerConfig.POWER_RESUME.point;
    var interval = playerConfig.POWER_RESUME.interval;
    
    setInterval(function(){
        player.resumePower(resumePoint);
        player.save();
    }, interval);
};

var startPowerGiveTimer = function(player) {
    var givePoint = playerConfig.POWER_GIVE.point;
    var hours = playerConfig.POWER_GIVE.hours;
    var interval = playerConfig.POWER_GIVE.interval;

    setInterval(function(){
        var hour = (new Date()).getHours();
        if (_.contains(hours, hour) && !player.hasGive(hour)) {
            player.givePower(hour, givePoint);
            player.save();
        }
    }, interval);
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

        startPowerResumeTimer(this);
    }

    Player.prototype.init = function () {
        this.cards = {};
    };

    Player.prototype.save = function() {
        Player.__super__.save.apply(this, arguments);
        // update all cards info
        _.values(this.cards).forEach(function(card){card.save()});
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
        this.set('power', _.max([power - value, 0]))
    };

    Player.prototype.resumePower = function(value) {
        var max_power = getMaxPower(this.lv, playerConfig.POWER_LIMIT);
        var power = this.get('power');
        this.set('power', _.min([max_power, power + value]));
    };

    Player.prototype.givePower = function(hour, value) {
        var max_power = getMaxPower(this.lv, playerConfig.POWER_LIMIT);
        var power = this.get('power');
        this.set('power', _.min([power + value, max_power + 50]));
        this.updateGift("power_"+hour);
    };

    Player.prototype.updateGift = function(gift) {
        this.set('dailyGift', this.get('dailyGift').push(gift));
    };

    Player.prototype.hasGive = function(gift) {
        return _.contains(this.get('dailyGift'), gift);
    };

    Player.prototype.strengthen = function(target, sources, cb) {
        if (!this.hasCard(target)) {
            return cb({msg: '找不到目标卡牌'}, null);
        }
        var targetCard = this.cards[target];
        var _res = targetCard.eatCards(this.popCards(sources));
        var expObtain = _res[0], upgradedLevel = _res[1];
        var moneyConsume = table.getTableItem('card_grow', targetCard.tableId).money_need;

        cb(null, {
            exp_obtain: expObtain, 
            upgraded_level: upgradedLevel, 
            moneyConsume: moneyConsume
        });
    };

    Player.prototype.hasCard = function(id) {
        return this.cards[id] !== 'undefined';
    };

    Player.prototype.getCard = function(id) {
        return this.cards[id] || null
    }

    Player.prototype.getCards = function(ids) {
        if (!_.isArray(ids)){
            ids = [ids];
        }

        var results = []
        for (var id in this.cards) {
            if (_.contains(ids, id)) {
                results.push(this.cards[id]);
            }
        }
        return results;
    };

    Player.prototype.popCards = function(ids) {
        var cards = [];
        for (var i = 0; i < ids.length; i++) {
            var _id = ids[i];
            var _card = this.cards[_id];
            if (!!_card) {
                cards.push(_card);
                delete this.cards[_id];
            }
        }
        return cards;
    };

    Player.prototype.getPassMarkByIndex = function (index) {
        if (index < 1) {
            console.log("关卡标记索引不存在");
            return;
        }

        var mark = (this.passMark >> (index - 1)) & 1;

        return (mark == 1);
    };

    Player.prototype.resetPassMarkByAll = function () {
        this.set("passMark", 0);
    };

    Player.prototype.setPassMarkByAll = function () {
        var mask = 1;
        var _passMark = this.passMark;

        for (var i = 0; i < this.pass; ++i) {
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

    Player.prototype.toJson = function () {
        return {
            id: this.id,
            userId: this.userId,
            areaId: this.areaId,
            name: this.name,
            power: this.power,
            lv: this.lv,
            exp: this.exp,
            money: this.money,
            gold: this.gold,
            lineUp: this.lineUp,
            ability: this.ability,
            task: this.task,
            pass: this.pass,
            passMark: this.passMark,
            dailyGift: this.dailyGift,
            fregments: this.fregments,
            elixir: this.elixir
        };
    };

    return Player;
})(Entity);

getMaxPower = function (lv, powerLimit) {
    var max_power = 50;
    for (var lv in powerLimit) {
        if (this.lv <= parseInt(lv)){
            max_power = powerLimit[lv];
            break;
        }
    }
    return max_power;
};

module.exports = Player;
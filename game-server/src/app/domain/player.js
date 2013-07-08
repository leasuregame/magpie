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

var startPowerResumeTimer = function(player) {
    var resumePoins = playerConfig.POWER_RESUME.poins;
    var interval = playerConfig.POWER_RESUME.interval;
    
    setInterval(function(){
        player.resumePower(resumePoins);
        player.save();
    }, interval);
};

var startPowerGiveTimer = function(player) {
    var givePoins = playerConfig.POWER_GIVE.poins;
    var hours = playerConfig.POWER_GIVE.hours;
    var interval = playerConfig.POWER_GIVE.interval;

    setInterval(function(){
        var hour = (new Date()).getHours();
        if (_.contains(hours, hour) && !player.hasGive(hour)) {
            player.givePower(hour, givePoins);
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
        var target_card = this.cards[target];
        if (typeof target_card == 'undefined') {
            return cb('找不到目标卡牌', null)
        }

        var source_cards = [];
        for (var i = 0; i < sources.length; i++) {
            var _id = sources[i];
            var _card = this.cards[_id];
            if (!!_card) {
                source_cards.push(_card);
            }
        }

        target_card.eatCards(source_cards);
        cb(null, player);
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
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


var utility = require('../../common/utility');
var Entity = require('./entity');
var playerConfig = require('../../../config/data/player');
var msgConfig = require('../../../config/data/message');
var spiritConfig = require('../../../config/data/spirit');
var lotteryConfig = require('../../../config/data/lottery');
var table = require('../../manager/table');
var _ = require("underscore");
var logger = require('pomelo-logger').getLogger(__filename);
var Card = require('./card');
var util = require('util');
var achieve = require('../achievement');
var MAX_LEVEL = require('../../../config/data/card').MAX_LEVEL;

var defaultMark = function() {
    var i, result = [];
    for (i = 0; i < 100; i++) {
        result.push(0);
    }
    return result;
};

var NOW = function() {
    return Date.now();
};

var addEvents = function(player) {
    // 经验值改变，判断是否升级
    player.on('exp.change', function(exp) {
        var upgradeInfo = table.getTableItem('player_upgrade', player.lv);
        console.log(upgradeInfo);
        if (exp >= upgradeInfo.exp) {
            player.increase('lv');
            player.set('exp', exp - upgradeInfo.exp);
            player.resumePower(getMaxPower(player.lv));
            player.save();
        }
    });

    // 玩家级别改变，判断是否达到成就
    player.on('lv.change', function(lv) {
        achieve.levelTo(player, lv);
    });

    player.on('give.bless', function() {
        achieve.gaveBless(player);
    });

    player.on('receive.bless', function() {
        achieve.receivedBless(player);
    });

    player.on('pass.change', function(pass) {
        if (typeof pass == 'string') {
            pass = JSON.parse(pass);
        }
        achieve.passTo(player, pass.layer);
    });

    player.on('elixir.increase', function(elixir) {
        achieve.elixirTo(player, elixir);
    });

    player.on('energy.increase', function(energy) {
        achieve.energyTo(player, energy);
    });

    player.on('money.consume', function(money) {
        achieve.moneyConsume(player, money);
    });

    player.on('gold.consume', function(gold) {
        achieve.goldConsume(player, gold);
    });

    player.on('power.consume', function(power) {
        achieve.powerConsume(player, power);
    });

    player.on('add.card', function(card) {
        if (player.isLineUpCard(card)) {
            //player.activeGroupEffect();
            player.activeSpiritorEffect();
        }
    });

    player.on('cash.change', function(cash) {
        var vipData = table.getTable('vip');
        var vips = vipData.map(function(item) {
            return {
                lv: item.lv,
                tc: item.total_cash
            };
        }).sort(function(x, y) {
            return x.tc - y.tc;
        });

        var oldVip = player.vip;
        var i, vip;
        for (i = 0; i < vips.length; i++) {
            vip = vips[i];
            next_tc = vips[i + 1] != null ? vips[i + 1].tc : Number.MAX_VALUE;
            if (cash >= vip.tc && cash < next_tc) {
                player.set('vip', vip.lv);
                player.save()
                break;
            }
        }
        if (oldVip == 0 && player.vip > 0) {
            achieve.vip(player);
        }
        recountVipPrivilege(player, oldVip);
    });
};

var correctPower = function(player) {
    var interval, power, now, times, resumePoint;

    interval = playerConfig.POWER_RESUME.interval;
    power = player.power;
    now = Date.now();

    if ((power.time + interval) <= now) {
        times = parseInt((now - power.time) / interval);
        resumePoint = playerConfig.POWER_RESUME.point;
        player.resumePower(resumePoint * times);
        player.save();
    }
};

/*
 * Player 与 player 表对应的数据类，提供简单操作
 * @param {object} param 数据库 player 表中的一行记录
 * */
var Player = (function(_super) {
    utility.extends(Player, _super);

    function Player(param) {
        addEvents(this);
        Player.__super__.constructor.apply(this, arguments);
    }

    Player.prototype.init = function() {
        // this.cards || (this.cards = {});
        // this.rank || (this.rank = {});
        // this.friends || (this.friends = []);

        // executeVipPrivilege(this);
        correctPower(this);
    };

    Player.FIELDS = [
        'id',
        'createTime',
        'userId',
        'areaId',
        'name',
        'power',
        'lv',
        'vip',
        'vipBox',
        'cash',
        'exp',
        'money',
        'gold',
        'skillPoint',
        'lineUp',
        'ability',
        'task',
        'pass',
        'dailyGift',
        'fragments',
        'energy',
        'elixir',
        'spiritor',
        'spiritPool',
        'signIn',
        'achievement'
    ];

    Player.DEFAULT_VALUES = {
        power: {
            time: 0,
            value: 50
        },
        lv: 1,
        vip: 0,
        vipBox: [],
        cash: 0,
        exp: 0,
        money: 0,
        gold: 0,
        lineUp: '12:-1',
        ability: 0,
        task: {
            id: 1,
            progress: 0,
            hasWin: false
        },
        pass: {
            layer: 0,
            mark: defaultMark()
        },
        dailyGift: {
            lotteryCount: lotteryConfig.DAILY_LOTTERY_COUNT, // 每日抽奖次数
            lotteryFreeCount: 0, // 每日免费抽奖次数
            powerGiven: [], // 体力赠送情况
            powerBuyCount: 2, // 购买体力次数
            challengeCount: 15, // 每日有奖竞技次数
            receivedBless: { // 接收的祝福
                count: msgConfig.MAX_RECEIVE_COUNT,
                givers: []
            },
            gaveBless: { // 送出的祝福
                count: msgConfig.MAX_GIVE_COUNT,
                receivers: []
            }
        },
        fragments: 0,
        energy: 0,
        elixir: 0,
        skillPoint: 0,
        spiritor: {
            lv: 0,
            spirit: 0
        },
        spiritPool: {
            lv: 0,
            exp: 0,
            collectCount: spiritConfig.MAX_COLLECT_COUNT
        },
        signIn: {
            months: {},
            flag: 0
        },
        achievement: {},
        cards: {},
        rank: {},
        friends: []
    };

    Player.prototype.increase = function(name, val) {
        Player.__super__.increase.apply(this, arguments);
        this.emit(name + '.increase', val == null ? 1 : val);
    };

    Player.prototype.decrease = function(name, val) {
        Player.__super__.decrease.apply(this, arguments);
        this.emit(name + '.consume', val == null ? 1 : val);
    };

    Player.prototype.achieve = function(id) {
        var dt = table.getTableItem('achievement', id);
        var ach = utility.deepCopy(this.achievement);
        if (!_.has(ach, id)) {
            ach[id] = {
                method: dt != null ? dt.method : 'not found',
                isAchieve: true,
                isTake: false,
                got: dt != null ? dt.need : 0
            };
        } else {
            ach[id].isAchieve = true;
            ach[id].got = dt.need;
        }
        // reset achievement
        this.achievement = ach;
    };

    Player.prototype.activeSpiritorEffect = function() {
        var spiritConfig = table.getTableItem('spirit', this.spiritor.lv);

        var cards = this.activeCards();
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var _hp = parseInt(card.init_hp * spiritConfig.hp_inc / 100);
            var _atk = parseInt(card.init_atk * spiritConfig.atk_inc / 100);

            card.incs.spirit_hp += _hp;
            card.incs.spirit_atk += _atk;
            card.recountHpAndAtk();
        }
    };

    Player.prototype.save = function() {
        Player.__super__.save.apply(this, arguments);
        // update all cards info
        _.values(this.cards).forEach(function(card) {
            card.save()
        });
    };

    Player.prototype.getAbility = function() {
        var ability = 0;
        this.activeCards().forEach(function(card) {
            var _a = card.ability();
            if (!_.isNaN(_a)) {
                ability += card.ability();
            }
        });
        this.set('ability', ability);
        return ability;
    };

    Player.prototype.updateAbility = function() {
        this.set('ability', this.getAbility());
    };

    Player.prototype.activeGroupEffect = function() {
        var cardIds = _.values(this.lineUpObj());
        var cards = _.values(this.cards).filter(function(id, c) {
            return c.star >= 3 && cardIds.indexOf(c.id) > -1;
        });
        var cardTable = table.getTable('cards');

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cardConfig = cardTable.getItem(card.id);
            var series = cardConfig.group.toString().split(',');
            var seriesCards = cardTable.filter(function(id, item) {
                return (series.indexOf(item.number) > -1) && (cardIds.indexOf(id) > -1);
            });

            if (!_.isEmpty(seriesCards) && (series.length === seriesCards.length)) {
                card.activeGroupEffect();
            }
        }
    };

    Player.prototype.isVip = function() {
        return this.vip > 0;
    };

    Player.prototype.addCard = function(card) {
        if (card instanceof Card && card.id !== null) {
            var cards = this.cards;
            cards[card.id] = card;
            this.cards = cards;

            this.emit('add.card', card);
        } else {
            throw new Error('should only can add a Card instance');
        }
    };

    Player.prototype.addCards = function(cards) {
        var self = this;
        _.each(cards, function(card) {
            self.addCard(card);
        });
    };

    Player.prototype.isLineUpCard = function(card) {
       // return _.has(this.cards, card.id);
        return _.has(_.values(this.lineUpObj()), card.id);
    };

    Player.prototype.hasCard = function(id) {
        return this.cards[id] !== 'undefined';
    };

    Player.prototype.getCard = function(id) {
        return this.cards[id] || null;
    };

    Player.prototype.getCards = function(ids) {
        if (!_.isArray(ids)) {
            ids = [ids];
        }

        return _.values(this.cards).filter(function(c) {
            return ids.indexOf(parseInt(c.id)) > -1;
        });
    };

    Player.prototype.popCards = function(ids) {
        var cards = [];
        for (var i = 0; i < ids.length; i++) {
            var _id = ids[i];
            var _card = this.cards[_id];
            if ( !! _card) {
                cards.push(_card);
                delete this.cards[_id];
            }
        }
        return cards;
    };

    Player.prototype.activeCards = function() {
        var cardIds = _.values(this.lineUpObj());
        return _.values(this.cards).filter(function(c) {
            return cardIds.indexOf(c.id) > -1;
        });
    };

    Player.prototype.updatePower = function(power) {
        if (this.power.value !== power.value) {
            this.set('power', power);
        }
    };

    Player.prototype.consumePower = function(value) {
        if (this.power.value <= 0) return;

        var power = _.clone(this.power);
        var cVal = value;
        if (value > power.value) {
            cVal = power.value;
        }
        power.value = _.max([power.value - value, 0]);
        power.time = Date.now();
        this.updatePower(power);
        this.emit('power.consume', cVal);
    };

    Player.prototype.resumePower = function(value) {
        var max_power = getMaxPower(this.lv);

        if (this.power.value >= max_power) return;

        var power = _.clone(this.power);
        power.value = _.min([max_power, power.value + value]);
        power.time = Date.now();
        this.updatePower(power);
    };

    Player.prototype.givePower = function(hour, value) {
        var max_power = getMaxPower(this.lv);
        var power = _.clone(this.power);
        power.value = _.min([power.value + value, max_power + 50]);
        power.time = Date.now();
        this.updatePower(power);

        // 更新dailyGift的power
        var dg = _.clone(this.dailyGift);
        dg.powerGiven.push(hour);
        this.dailyGift = dg;
    };

    Player.prototype.updateGift = function(name, value) {
        dg = _.clone(this.dailyGift);
        dg[name] = value;
        this.dailyGift = dg;
    };
    /*
    Player.prototype.hasGive = function(gift) {
        return _.contains(this.dailyGift.power, gift);
    };
   */
    Player.prototype.updateLineUp = function(lineupObj) {
        this.set('lineUp', objToLineUp(lineupObj));
    };

    Player.prototype.lineUpObj = function() {
        return lineUpToObj(this, this.lineUp);
    };

    Player.prototype.strengthen = function(target, sources, cb) {
        var _this = this;

        var targetCard = this.getCard(target);
        if (typeof targetCard == 'undefined' || targetCard == null) {
            return cb({
                code: 501,
                msg: '找不到目标卡牌'
            });
        }
        var source_cards = this.getCards(sources);
        if (source_cards.length == 0) {
            return cb({
                code: 501,
                msg: '找不到素材卡牌'
            });
        }

        var before_lv = targetCard.lv;
        var expObtain = 0;
        source_cards.forEach(function(card) {
            var row = table.getTable('card_grow').findOne(function(id) {
                return parseInt(id) == card.lv;
            });
            if (row !== null) {
                expObtain += parseInt(row.cur_exp + card.exp);
            }
        });

        // 预升级，得到升级的级数和剩余的经验
        // 不会改变卡牌的属性
        var _ref = targetCard.vitual_upgrade(expObtain);
        var upgraded_lv = _ref[0];
        var exp_remain = _ref[1];

        var items = table.getTable('card_grow').filter(function(id, item) {
            return item.lv >= before_lv && item.lv < (targetCard.lv + upgraded_lv);
        });
        var moneyConsume = 0;
        items.forEach(function(item) {
            moneyConsume += item.money_need;
        });

        moneyConsume = parseInt(moneyConsume);
        if (this.money < moneyConsume) {
            return cb({
                code: 501,
                msg: '铜板不足'
            });
        }

        this.decrease('money', moneyConsume);
        targetCard.upgrade(upgraded_lv, exp_remain);

        // 第一张满级五星卡
        if (targetCard.star == 5 && targetCard.lv == MAX_LEVEL[5]) {
            achieve.star5cardFullLevel(this);
        }

        return cb(null, {
            exp_obtain: expObtain,
            cur_lv: targetCard.lv,
            cur_exp: targetCard.exp,
            money_consume: parseInt(moneyConsume)
        }, targetCard);
    };

    Player.prototype.setPassMark = function(layer) {
        if (layer < 1 || layer > 100) {
            logger.warn('无效的关卡层数 ', layer);
            return;
        }

        var pass = _.clone(this.pass);
        if (pass.layer + 1 < layer) {
            logger.warn('未达到该关卡层数', layer);
            return;
        }
        pass.mark[layer - 1] = 1;
        this.set('pass', pass);
    };

    Player.prototype.hasPassMark = function(layer) {
        if (layer < 1 || layer > 100) {
            logger.warn('无效的关卡层数 ', layer);
            return;
        }
        var mark = this.pass.mark[layer - 1];
        return (mark === 1);
    };

    Player.prototype.incPass = function() {
        var pass = _.clone(this.pass);
        if (pass.layer >= 100)
            return;
        pass.layer++;
        this.set('pass', pass);
    };

    Player.prototype.signToday = function() {
        var d = new Date();
        var key = util.format('%d%d', d.getFullYear(), d.getMonth() + 1);
        var si = utility.deepCopy(this.signIn);

        if (!_.has(si, key)) {
            var _months = Object.keys(si.months);
            if (_months.length >= 12) {
                delete si.months[_months[0]];
            }
            si.months[key] = 0;
        }

        si.months[key] = utility.mark(si.months[key], d.getDay() + 1);
        this.signIn = si;
    };

    Player.prototype.signFirstUnsignDay = function() {
        var key = util.format('%d%d', d.getFullYear(), d.getMonth() + 1);
        var si = utility.deepCopy(this.signIn);

        if (!_.has(si, key)) {
            return;
        }
        var firsUnsignDay = 0;
        for (var i = 1; i <= 31; i++) {
            if (!utility.hasMark(si.months[key], i)) {
                utility.mark(si.months[key], i);
                firstUnsignDay = i;
                break;
            }
        }
        return firstUnsignDay;
    };

    Player.prototype.signDays = function() {
        var i, days = 0;
        var d = new Date();
        var key = util.format('%d%d', d.getFullYear(), d.getMonth() + 1);

        for (i = 1; i <= 31; i++) {
            if (utility.hasMark(this.signIn.months[key], i)) {
                days += 1;
            }
        }
        console.log('sidn days: ', days);
        return days;
    };

    Player.prototype.setSignInFlag = function(id) {
        var si = utility.deepCopy(this.signIn);
        si.flag = utility.mark(parseInt(si.flag), id);
        this.signIn = si;
    };

    Player.prototype.hasSignInFlag = function(id) {
        return utility.hasMark(parseInt(this.signIn.flag), id);
    };

    Player.prototype.giveBlessOnce = function() {
        this.emit('give.bless');
    };

    Player.prototype.receiveBlessOnce = function() {
        this.emit('receive.bless');
    };

    Player.prototype.toJson = function() {
        return {
            id: this.id,
            createTime: this.createTime,
            userId: this.userId,
            areaId: this.areaId,
            name: this.name,
            power: this.power,
            lv: this.lv,
            vip: this.vip,
            vipBox: this.vipBox,
            cash: this.cash,
            exp: this.exp,
            money: this.money,
            gold: this.gold,
            lineUp: this.lineUpObj(),
            ability: this.getAbility(),
            task: this.task,
            pass: checkPass(this.pass),
            dailyGift: utility.deepCopy(this.dailyGift),
            skillPoint: this.skillPoint,
            energy: this.energy,
            fregments: this.fregments,
            elixir: this.elixir,
            spiritor: this.spiritor,
            spiritPool: utility.deepCopy(this.spiritPool),
            cards: _.values(this.cards).map(function(card) {
                return card.toJson();
            }),
            rank: !_.isEmpty(this.rank) ? this.rank.toJson() : {},
            friends: this.friends,
            signIn: utility.deepCopy(this.signIn)
        };
    };

    return Player;
})(Entity);

// var processSpiritPoll = function(sp) {
//     if (_.isEmpty(sp)) {
//         return sp;
//     }
//     sp = utility.deepCopy(sp);
//     sp.collectCount = spiritConfig.MAX_COLLECT_COUNT - sp.collectCount;
//     return sp;
// };

// var processDailyGift = function(dg) {
//     if (_.isEmpty(dg)) {
//         return dg;
//     }
//     dg = utility.deepCopy(dg);
//     dg.gaveBless.count = msgConfig.MAX_GIVE_COUNT - dg.gaveBless.count;
//     dg.receivedBless.count = msgConfig.MAX_RECEIVE_COUNT - dg.receivedBless.count;
//     dg.lotteryCount = lotteryConfig.DAILY_LOTTERY_COUNT - dg.lotteryCount;
//     return dg;
// };

var checkPass = function(pass) {
    if (typeof pass !== 'object') {
        pass = {
            layer: 0,
            mark: defaultMark()
        };
    }
    return pass;
};

var lineUpToObj = function(self, lineUp) {
    var _results = {};
    if (_.isString(lineUp) && lineUp !== '') {
        var lines = lineUp.split(',');
        lines.forEach(function(l) {
            var _ref = l.split(':'),
                pos = _ref[0],
                num = parseInt(_ref[1]);

            _results[positionConvert(pos)] = num;

        });
    }
    return _results;
};

var objToLineUp = function(obj) {
    var order = ['00', '01', '02', '10', '11', '12'];
    var _lineUp = '';

    for (var key in obj) {
        _lineUp += '' + order[parseInt(key) - 1] + ':' + obj[key] + ',';
    }
    return _lineUp.slice(0, -1);
};

var positionConvert = function(val) {
    var order = ['00', '01', '02', '10', '11', '12'];
    return order.indexOf(val) + 1;
};

var getMaxPower = function(lv) {
    var max_power = 50;
    var powerLimit = playerConfig.POWER_LIMIT;
    for (var lv in powerLimit) {
        if (this.lv <= parseInt(lv)) {
            max_power = powerLimit[lv];
            break;
        }
    }
    return max_power;
};


var recountVipPrivilege = function(player, oldVip) {
    var curVip = player.vip;
    var diff = curVip - oldVip;
    if (diff <= 0) return;

    var oldVipInfo = table.getTableItem('vip_privilege', oldVip);
    var curVipInfo = table.getTableItem('vip_privilege', curVip);

    var dg = utility.deepCopy(player.dailyGift);
    dg.lotteryFreeCount += curVipInfo.lottery_free_count - oldVipInfo.lottery_free_count;

    dg.powerBuyCount += curVipInfo.buy_power_count - oldVipInfo.buy_power_count;
    dg.gaveBless.count += curVipInfo.give_bless_count - oldVipInfo.give_bless_count;
    dg.receivedBless.count += curVipInfo.receive_bless_count - oldVipInfo.receive_bless_count;
    dg.challengeCount += curVipInfo.challenge_count - oldVipInfo.challenge_count;
    player.dailyGift = dg;

    var sp = utility.deepCopy(player.spiritPool);
    sp.collectCount += curVipInfo.spirit_collect_count - oldVipInfo.spirit_collect_count;
    player.spiritPool = sp;
    console.log(sp);
    player.save();
};

var executeVipPrivilege = function(player) {
    if (!player.isVip()) return;

    var pri = table.getTableItem('vip_privilege', player.vip);
    var dg = _.clone(player.dailyGift);
    dg.lotteryFreeCount += pri.lottery_free_count;
    // 好友上限 ++
    dg.powerBuyCount += pri.buy_power_count;
    dg.gaveBless.count += pri.give_bless_count;
    dg.receivedBless.count += pri.receive_bless_count;
    dg.challengeCount += pri.challege_count;

    player.dailyGift = dg;

    var sp = _.clone(player.spiritPool);
    sp.collectCount += pri.spirit_collect_count;

    player.spiritPool = sp;
    player.save();
};

module.exports = Player;
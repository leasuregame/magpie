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
var MarkGroup = require('../../common/markGroup');
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
var SPIRITOR_PER_LV = require('../../../config/data/card').ABILIGY_EXCHANGE.spiritor_per_lv;
var EXP_CARD_ID = require('../../../config/data/card').EXP_CARD_ID;
var DEFAULT_SPIRIT = require('../../../config/data/spirit').DEFAULT_SPIRIT;

var cardLvs = table.getTable('card_lv_limit');
var resData = table.getTableItem('resource_limit', 1);
var MAX_POWER_VALUE = resData.power_value;
var MAX_CARD_COUNT = resData.card_count_limit;

var lvLimit = table.getTableItem('lv_limit', 1);
var MAX_SPIRITOR_LV = lvLimit.spirit_lv_limit;
var MAX_SPIRITPOOL_LV = lvLimit.spirit_pool_lv_limit;

var giveBlessTab = table.getTable('give_bless_config');
var receiveBlessTab = table.getTable('receive_bless_config');
var friendsCountTab = table.getTable('friends_config');
var DEFAULT_RECEIVE_COUNT = giveBlessTab.getItem(1).count;
var DEFAULT_GIVE_COUNT = receiveBlessTab.getItem(1).count;
var DEFAULT_FRIENDS_COUNT = friendsCountTab.getItem(1).count;

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
    // // 经验值改变，判断是否升级
    // player.on('exp.change', function(exp) {
    //     if (player.lv <= 0 || player.lv >= playerConfig.MAX_PLAYER_LV) {
    //         return;
    //     }

    //     var upgradeInfo = table.getTableItem('player_upgrade', player.lv);
    //     if (exp >= upgradeInfo.exp) {
    //         player.increase('lv');
    //         // 清空每级仙丹使用详细信息
    //         player.elixirPerLv = {};
    //         player.set('exp', exp - upgradeInfo.exp);
    //         // 获得升级奖励
    //         player.increase('money', upgradeInfo.money);
    //         player.increase('energy', upgradeInfo.energy);
    //         player.increase('skillPoint', upgradeInfo.skillPoint);
    //         player.increase('elixir', upgradeInfo.elixir);
    //         //升级后体力不再回复
    //         //player.resumePower(getMaxPower(player.lv));
    //         player.isUpgrade = true;
    //         player.save();
    //     }
    // });

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

    player.on('passLayer.change', function(layer) {
        achieve.passTo(player, layer);
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
            player.activeSpiritorEffect();
        }

        if (!player.cardBookMark.hasMark(card.tableId) && card.tableId != EXP_CARD_ID) {
            card.isNewLightUp = true;
            player.cardBookMark.mark(card.tableId);
            var cardBook = utility.deepCopy(player.cardBook);
            cardBook.mark = player.cardBookMark.value;
            player.cardBook = cardBook;
            player.save();
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
    var interval, power, now, times = 1, resumePoint;

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
        this.taskMark = new MarkGroup(this.task.mark);
        this.passMark = new MarkGroup(this.pass.mark);
        this.cardBookMark = new MarkGroup(this.cardBook.mark);
        this.cardBookFlag = new MarkGroup(this.cardBook.flag);
        this.levelRewardMark = new MarkGroup(this.levelReward);
        this.momo = [];
        //this.momoMark = new MarkGroup(this.task.momo);
    }

    Player.prototype.init = function() {
        // this.cards || (this.cards = {});
        // this.rank || (this.rank = {});
        // this.friends || (this.friends = []);

        // executeVipPrivilege(this);
        correctPower(this);
        this.created = utility.dateFormat(new Date(this.created), 'yyyy-MM-dd h:mm:ss');
    };

    Player.FIELDS = [
        'id',
        'uniqueId',
        'created',
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
        'passLayer',
        'pass',
        'dailyGift',
        'fragments',
        'energy',
        'elixir',
        'elixirPerLv',
        'spiritor',
        'spiritPool',
        'signIn',
        'achievement',
        'cardBook',
        'friendsCount',
        'rowFragmentCount',
        'highFragmentCount',
        'highDrawCardCount',
        'cardsCount',
        'resetDate',
        'firstTime',
        'levelReward'
    ];

    Player.DEFAULT_VALUES = {
        power: {
            time: 0,
            value: 500
        },
        lv: 1,
        vip: 0,
        vipBox: [],
        cash: 0,
        exp: 0,
        money: 10000,
        gold: 20,
        lineUp: '12:-1',
        ability: 0,
        task: {
            id: 1,
            progress: 0,
            hasWin: false,
            mark: [],
            hasFragment: -1
        },
        passLayer: 0,
        pass: {
            mark: [],
            mystical: {
                diff: 1,
                isTrigger: false,
                isClear: false
            },
            resetTimes: 1
        },
        dailyGift: {
            lotteryCount: lotteryConfig.DAILY_LOTTERY_COUNT, // 每日抽奖次数
            lotteryFreeCount: 0, // 每日免费抽奖次数
            powerGiven: [], // 体力赠送情况
            powerBuyCount: 3, // 购买体力次数
            challengeCount: 10, // 每日有奖竞技次数
            challengeBuyCount: 10, //每日有奖竞技购买次数
            receivedBless: { // 接收的祝福
                count: DEFAULT_RECEIVE_COUNT,
                givers: []
            },
            gaveBless: { // 送出的祝福
                count: DEFAULT_GIVE_COUNT,
                receivers: []
            }
        },
        fragments: 0,
        energy: 0,
        elixir: 0,
        elixirPerLv: {},
        skillPoint: 0,
        spiritor: {
            lv: 1,
            spirit: DEFAULT_SPIRIT
        },
        spiritPool: {
            lv: 1,
            exp: 0,
            collectCount: spiritConfig.MAX_COLLECT_COUNT
        },
        signIn: {},
        achievement: {},
        cardBook: {
            mark: [],
            flag: []
        },
        cards: {},
        rank: null,
        friends: [],
        friendsCount: DEFAULT_FRIENDS_COUNT,
        rowFragmentCount: 0,
        highFragmentCount: 0,
        highDrawCardCount: 0,
        cardsCount: 100,
        resetDate: '1970-1-1',
        firstTime: {
            lowLuckyCard: 1,
            highLuckyCard: 1
        },
        levelReward: []
    };

    Player.prototype.resetData = function() {

        var realCount = function(lv, tab) {
            var keys = tab.map(function(i) {
                return i.id;
            });
            var _i, _len, k, step = 5;

            var _ref = keys.reverse();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                k = _ref[_i];
                if (lv >= k) {
                    step = tab.getItem(k).count;
                    break;
                }
            }
            return step;
        };

        var vipPrivilege = table.getTableItem('vip_privilege', this.vip);

        var dg = {
            lotteryCount: lotteryConfig.DAILY_LOTTERY_COUNT, // 每日抽奖次数
            lotteryFreeCount: 0 + vipPrivilege.lottery_free_count, // 每日免费抽奖次数
            powerGiven: [], // 体力赠送情况
            powerBuyCount: 3 + vipPrivilege.buy_power_count, // 购买体力次数
            challengeCount: 10 + vipPrivilege.challenge_count, // 每日有奖竞技次数
            challengeBuyCount: 10, // 每日有奖竞技购买次数
            receivedBless: { // 接收的祝福
                count: realCount(this.lv, receiveBlessTab) + vipPrivilege.receive_bless_count,
                givers: []
            },
            gaveBless: { // 送出的祝福
                count: realCount(this.lv, giveBlessTab) + vipPrivilege.give_bless_count,
                receivers: []
            }
        };

        var pass = utility.deepCopy(this.pass);
        pass.resetTimes = 1;
        pass.mark = [];

        var task = utility.deepCopy(this.task);
        task.mark = [];

        var spiritPool = utility.deepCopy(this.spiritPool);
        spiritPool.collectCount = spiritConfig.MAX_COLLECT_COUNT + vipPrivilege.spirit_collect_count;

        this.dailyGift = dg;
        this.pass = pass;
        this.task = task;
        this.spiritPool = spiritPool;
        this.friendsCount = realCount(this.lv, friendsCountTab) + vipPrivilege.friend_count;
        this.resetDate = utility.shortDateString();
    };

    Player.prototype.isReset = function() {
        return this.resetDate === utility.shortDateString();
    };

    Player.prototype.increase = function(name, val) {
        var rdata = table.getTableItem('resource_limit', 1);
        if (_.contains(['gold', 'money', 'skillPoint', 'energy'], name)) {
            if ((this[name] + (val || 1)) > rdata[name]) {
                val = rdata[name] - this[name];
            }
        }

        Player.__super__.increase.apply(this, [name, val]);
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
        if (typeof spiritConfig == 'undefined' || spiritConfig == null) {
            logger.error('can not fine spirit config infi by level ' + this.spiritor.lv);
            return;
        }
        var cards = this.activeCards();
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var incs = {
                spirit_hp: 0,
                spirit_atk: 0
            };
            var _hp = parseInt(card.init_hp * spiritConfig.hp_inc / 100);
            var _atk = parseInt(card.init_atk * spiritConfig.atk_inc / 100);

            incs.spirit_hp += _hp;
            incs.spirit_atk += _atk;

            // 最小值为1
            incs.spirit_hp = _.max([incs.spirit_hp, 1]);
            incs.spirit_atk = _.max([incs.spirit_atk, 1]);

            _.extend(card.incs, incs);
            card.recountHpAndAtk();
        }
    };

    Player.prototype.incSpirit = function(val) {
        if (typeof val !== 'number') {
            logger.warn('can not increase spirit of player by value:', val);
            return;
        }
        var spiritor = _.clone(this.spiritor);        
        spiritor.spirit = spiritor.spirit + val;
        this.set('spiritor', spiritor);
    };

    Player.prototype.canUpgradeSpiritor = function(){
        var spiritorData = table.getTableItem('spirit', this.spiritor.lv);
        if (!!spiritorData && this.spiritor.spirit >= spiritorData.spirit_need) {
            return true;
        }
        return false;
    };

    Player.prototype.spiritorUprade = function() {
        var spiritor = _.clone(this.spiritor);
        var total_spirit = spiritor.spirit;
        var spiritorData = table.getTableItem('spirit', spiritor.lv);

        if ( !! spiritorData && total_spirit >= spiritorData.spirit_need && spiritor.lv < MAX_SPIRITOR_LV) {
            spiritor.lv += 1;
            total_spirit -= spiritorData.spirit_need;
        }
        spiritor.spirit = total_spirit;
        this.set('spiritor', spiritor);
    };

    Player.prototype.incSpiritPoolExp = function(exp) {
        var sp = _.clone(this.spiritPool);
        var total_exp = sp.exp + exp;
        var spData = table.getTableItem('spirit_pool', sp.lv);

        while ( !! spData && total_exp >= spData.exp_need && sp.lv < MAX_SPIRITPOOL_LV) {
            sp.lv += 1;
            total_exp -= spData.exp_need;
            spData = table.getTableItem('spirit_pool', sp.lv);
        }
        sp.exp = total_exp;
        this.set('spiritPool', sp);
    };

    Player.prototype.save = function() {
        Player.__super__.save.apply(this, arguments);
        // update all cards info
        _.values(this.cards).forEach(function(card) {
            card.save();
        });

        if (!_.isEmpty(this.rank)) {
            this.rank.save();
        }
    };

    Player.prototype.getAbility = function() {
        var ability = 0;
        this.activeCards().forEach(function(card) {
            var _a = card.ability();
            if (!_.isNaN(_a)) {
                ability += card.ability();
            }
        });
        // 元神加成的战斗力
        if (this.spiritor.lv > 0) {
            ability += this.spiritor.lv * SPIRITOR_PER_LV;
        }

        this.set('ability', ability);
        return ability;
    };

    Player.prototype.updateAbility = function() {
        this.set('ability', this.getAbility());
    };

    Player.prototype.activeGroupEffect = function() {
        var cardIds = _.values(lineUpToObj(this.lineUp));
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
        return _.contains(_.values(lineUpToObj(this.lineUp)), card.id);
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
        var cardIds = _.values(lineUpToObj(this.lineUp));
        return _.values(this.cards).filter(function(c) {
            return cardIds.indexOf(c.id) > -1;
        });
    };

    Player.prototype.updatePower = function(power) {
        //if (this.power.value !== power.value) {
        this.set('power', power);
        //}
    };

    Player.prototype.consumePower = function(value) {
        if (this.power.value <= 0) return;

        var power = utility.deepCopy(this.power);
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

        var power = utility.deepCopy(this.power);
        power.value = _.min([max_power, power.value + value]);
        power.time = Date.now();
        this.updatePower(power);
    };

    //直接添加体力，不受上限限制
    Player.prototype.addPower = function(value) {
        var power = _.clone(this.power);
        power.value += value;
        power.time = Date.now();
        this.updatePower(power);
    };

    Player.prototype.givePower = function(hour, value) {
        var power = utility.deepCopy(this.power);
        power.value += value;
        power.time = Date.now();
        this.updatePower(power);

        // 更新dailyGift的power
        var dg = utility.deepCopy(this.dailyGift);
        dg.powerGiven.push(hour);
        this.dailyGift = dg;
    };

    Player.prototype.updateGift = function(name, value) {
        dg = utility.deepCopy(this.dailyGift);
        dg[name] = value;
        this.dailyGift = dg;
    };

    Player.prototype.updateLineUp = function(lineupObj) {
        this.set('lineUp', objToLineUp(lineupObj));
        checkLineUp(this);
    };

    Player.prototype.lineUpObj = function() {
        checkLineUp(this);
        return lineUpToObj(this.lineUp);
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
        var source_cards = this.popCards(sources);
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
                msg: '仙币不足'
            });
        }

        this.decrease('money', moneyConsume);
        targetCard.upgrade(upgraded_lv, exp_remain);

        // 第一张满级五星卡
        if (targetCard.star == 5 && targetCard.lv == cardLvs.getItem(5).max_lv) {
            achieve.star5cardFullLevel(this);
        }

        return cb(null, {
            exp_obtain: expObtain,
            cur_lv: targetCard.lv,
            cur_exp: targetCard.exp,
            ability: targetCard.ability(),
            money_consume: parseInt(moneyConsume)
        }, targetCard);
    };

    Player.prototype.setMomoMark = function() {
        var taskData = table.getTableItem('task', this.task.id);
        if (taskData) {
            var chapterId = taskData.chapter_id;
            this.momoMark.mark(chapterId - 1);
            var task = (this.task);
            task.momo = this.momoMark.value;
            this.task = task;
        }
    };

    Player.prototype.hasMomoMark = function() {
        var taskData = table.getTableItem('task', this.task.id);
        if (taskData) {
            var chapterId = taskData.chapter_id;
            return this.momoMark.hasMark(chapterId - 1);
        } else {
            return true; // 不存在的关卡，当做已经领取了 哈哈
        }
    };

    /*
     魔石数量  魔石个数

     1--5       6个

     2--10      2个

     5--20      1个

     5--50      1个

     */
    Player.prototype.createMonoGift = function() { //产生摸一摸奖励
        // var task = utility.deepCopy(this.task);
        this.momo = new Array(10);
        for (var i = 0; i < 6; i++) {
            this.momo[i] = _.random(1, 5);
        }
        for (var i = 6; i < 8; i++) {
            this.momo[i] = _.random(2, 10);
        }
        this.momo[8] = _.random(5, 20);
        this.momo[9] = _.random(5, 50);

        return this.momo;
    };

    Player.prototype.clearMonoGift = function() { //领取清除摸一摸奖励
        this.momo = [];
    };

    Player.prototype.getMonoGiftTotal = function() { //摸一摸产生奖励总和
        var value = 0;
        for (var i = 0; i < this.momo.length; i++)
            value += this.momo[i];
        return value;
    };

    Player.prototype.setTaskMark = function(chapter) {
        this.taskMark.setValue(this.task.mark).mark(chapter);
        var task = utility.deepCopy(this.task);
        task.mark = this.taskMark.value;
        this.task = task;
    };

    Player.prototype.hasTaskMark = function(chapter) {
        return this.taskMark.setValue(this.task.mark).hasMark(chapter);
    };

    Player.prototype.setPassMark = function(layer) {
        if (layer < 1 || layer > 100) {
            logger.warn('无效的关卡层数 ', layer);
            return;
        }

        var pass = utility.deepCopy(this.pass);
        if (this.passLayer + 1 < layer) {
            logger.warn('未达到该关卡层数', layer);
            return;
        }
        this.passMark.mark(layer);
        pass.mark = this.passMark.value;
        this.pass = pass;
    };

    Player.prototype.hasPassMark = function(layer) {
        if (layer < 1 || layer > 100) {
            logger.warn('无效的关卡层数 ', layer);
            return;
        }
        return this.passMark.hasMark(layer);
    };

    Player.prototype.canResetPassMark = function() {
        for (var i = 1; i <= this.passLayer; i++) {
            if (this.passMark.hasMark(i)) {
                return true;
            }
        }
        return false;
    };

    //重置关卡
    Player.prototype.resetPassMark = function() {

        if (this.pass.resetTimes > 0) {
            this.pass.resetTimes--;
            var pass = utility.deepCopy(this.pass);
            this.passMark.value = [];
            pass.mark = this.passMark.value;
            this.pass = pass;
            return true;
        }
        return false;
    };

    Player.prototype.incPass = function() {
        this.increase('passLayer');
    };

    Player.prototype.getPass = function() {
        checkPass(this);
        return {
            canReset: this.pass.resetTimes > 0 ? true : false,
            layer: this.passLayer,
            mark: this.pass.mark,
            hasMystical: this.hasMysticalPass()
        };
    };

    Player.prototype.triggerMysticalPass = function() {
        var pass = utility.deepCopy(this.pass);
        pass.mystical.isTrigger = true;
        pass.mystical.isClear = false;
        this.set('pass', pass);
    };

    Player.prototype.clearMysticalPass = function() {
        var pass = utility.deepCopy(this.pass);
        pass.mystical.isClear = true;
        pass.mystical.diff += 1;
        pass.mystical.isTrigger = false;
        this.set('pass', pass);
    };

    Player.prototype.hasMysticalPass = function() {
        if (this.pass.mystical.isTrigger && !this.pass.mystical.isClear)
            return true;
        return false;
    };

    Player.prototype.signToday = function() {
        var key = singInKey();
        var si = utility.deepCopy(this.signIn);

        if (!_.has(si, key)) {
            var _months = Object.keys(si);
            if (_months.length >= 12) {
                delete si[_months[0]];
            }
            si[key] = {
                mark: 0,
                flag: 0
            };
        }

        si[key].mark = utility.mark(si[key].mark, new Date().getDate());
        this.signIn = si;
    };

    Player.prototype.signFirstUnsignDay = function() {
        var key = singInKey();
        var si = utility.deepCopy(this.signIn);

        if (!_.has(si, key)) {
            si[key] = {
                mark: 0,
                flag: 0
            };
        }

        var firstUnsignDay = 31;
        var count = new Date().getDate();
        for (var i = 1; i < count; i++) {
            if (!utility.hasMark(si[key].mark, i)) {
                si[key].mark = utility.mark(si[key].mark, i);
                this.signIn = si;
                firstUnsignDay = i;
                break;
            }
        }
        return firstUnsignDay;
    };

    Player.prototype.signDays = function() {
        var i, days = 0;
        var key = singInKey();

        if (!_.has(this.signIn, key)) {
            return 0;
        }

        var mark = this.signIn[key].mark;
        for (i = 1; i <= 31; i++) {
            if (utility.hasMark(mark, i)) {
                days += 1;
            }
        }
        return days;
    };

    Player.prototype.setSignInFlag = function(id) {
        var si = utility.deepCopy(this.signIn);
        var key = singInKey();
        if (!_.has(si, key)) {
            si[key] = {
                mark: 0,
                flag: 0
            };
        } else {
            si[key].flag = utility.mark(parseInt(si[key].flag), id);
        }
        
        this.signIn = si;
    };

    Player.prototype.hasSignInFlag = function(id) {
        var key = singInKey();
        return utility.hasMark(parseInt(this.signIn[key].flag), id);
    };

    Player.prototype.giveBlessOnce = function() {
        this.emit('give.bless');
    };

    Player.prototype.receiveBlessOnce = function() {
        this.emit('receive.bless');
    };

    Player.prototype.canUseElixir = function() {
        if (this.lv >= 80) {
            return Number.MAX_VALUE;
        }
        return elixirLimit(this.lv);
    };

    Player.prototype.useElixirForCard = function(cardId, elixir) {
        var epl = utility.deepCopy(this.elixirPerLv);
        if (_.has(epl, cardId)) {
            epl[cardId] += elixir;
        } else {
            epl[cardId] = elixir;
        }
        this.elixirPerLv = epl;
    };

    Player.prototype.getRanking = function() {
        var rank = {
            ranking: 0
        };
        if(this.rank) {
            rank.ranking = this.rank.ranking;
        }
        return rank;
    };

    Player.prototype.getRank = function() {
        var rank = {
            ranking: 0,
            canGetReward: [],
            notCanGetReward: []
        };
        if(this.rank) {
            rank.ranking = this.rank.ranking;
            rank.canGetReward = this.rank.rankingRewards();
            rank.notCanGetReward = this.rank.rewardsNotHave();
        }
        return rank;
    };

    Player.prototype.getTask = function(){
        return {
            id: this.task.id,
            progress: this.task.progress,
            mark: this.task.mark
        };
    };

    Player.prototype.getSpiritor = function() {

        var spiritor = {
            lv: this.spiritor.lv,
            spirit: this.spiritor.spirit,
            ability: this.spiritor.lv * SPIRITOR_PER_LV
        };

        return spiritor;
    };

    Player.prototype.addFriend = function(friend) {
        this.friends.push(friend);
    };

    Player.prototype.delFriend = function(fid) {
        var i, fri;
        for(i = 0; i < this.friends.length; i++) {
            fri = this.friends[i];
            if (fri.id == fid) {
                this.friends.splice(i, 1);
                break;
            }
        }
    };

    Player.prototype.hasFirstTime = function(){
        var ft = this.firstTime;
        for (var key in ft) {
            if (ft[key]) {
                return true;
            }
        }
        return false;
    };

    Player.prototype.setFirstTime = function(name, val) {
        var ft = utility.deepCopy(this.firstTime);
        ft[name] = val;
        this.set('firstTime', ft);
    };

    Player.prototype.hasLevelReward = function(val) {
        return this.levelRewardMark.hasMark(val);
    };

    Player.prototype.setLevelReward = function(val) {
        this.levelRewardMark.mark(val);
        this.levelReward = this.levelRewardMark.value;
    };

    Player.prototype.toJson = function() {
        return {
            id: this.id,
            uniqueId: this.uniqueId,
            createTime: new Date(this.created).getTime(),
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
            task: this.getTask(),
            pass: this.getPass(),
            dailyGift: utility.deepCopy(this.dailyGift),
            skillPoint: this.skillPoint,
            energy: this.energy,
            fragments: this.fragments,
            elixir: this.elixir,
            spiritor: this.getSpiritor(),
            spiritPool: utility.deepCopy(this.spiritPool),
            cards: _.values(this.cards)
                .sort(function(x, y){
                    return y.createTime - x.createTime;
                })
                .map(function(card) {
                    return card.toJson();
                }),
            rank: this.getRanking(),
            signIn: utility.deepCopy(this.signIn),
            firstTime: this.hasFirstTime() ? this.firstTime : void 0
        };
    };

    return Player;
})(Entity);

var singInKey = function() {
    var d = new Date();
    return util.format('%d%d', d.getFullYear(), d.getMonth() + 1);
};

var elixirLimit = function(lv) {
    if (lv <= 50) {
        return 2000 * lv;
    } else {
        return 2000 * 50 + 4000 * (lv - 50);
    }
};

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

var checkPass = function(player) {
    if (typeof player.pass !== 'object') {
        player.pass = {
            mark: [],
            mystical: {
                diff: 1,
                isTrigger: false,
                isClear: false
            },
            resetTimes: 0
        };
    }
};

var lineUpToObj = function(lineUp) {
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

var checkLineUp = function(player) {
    var obj = lineUpToObj(player.lineUp);
    var obj_copy = _.clone(obj);
    var vals = _.values(obj);
    var card_count = vals.filter(function(v) {
        return v !== -1;
    }).length;
    console.log(obj, vals, card_count);

    var fdata = table.getTableItem('function_limit', 1);
    var lvMap = {
        3: fdata.card3_position,
        4: fdata.card4_position,
        5: fdata.card5_position
    };

    var qty, lv, limit = 5;
    for (qty in lvMap) {
        lv = lvMap[qty];
        if (player.lv < lv) {
            limit = parseInt(qty) - 1;
            break;
        }
    }

    if (card_count > limit) {
        for (var i = 0; i < card_count - limit; i++) {
            for (j in obj_copy) {
                if (obj_copy[j] !== -1) {
                    delete obj_copy[j];
                    break;
                }
            }
        }
    }
    player.lineUp = objToLineUp(obj_copy);
};

var positionConvert = function(val) {
    var order = ['00', '01', '02', '10', '11', '12'];
    return order.indexOf(val) + 1;
};

var getMaxPower = function(lv) {
    // var max_power = 50;
    // var powerLimit = playerConfig.POWER_LIMIT;
    // for (var lv in powerLimit) {
    //     if (this.lv <= parseInt(lv)) {
    //         max_power = powerLimit[lv];
    //         break;
    //     }
    // }
    // return max_power;

    return MAX_POWER_VALUE;
};


var recountVipPrivilege = function(player, oldVip) {
    var curVip = player.vip;
    var diff = curVip - oldVip;
    if (diff <= 0) return;

    var oldVipInfo = table.getTableItem('vip_privilege', oldVip);
    var curVipInfo = table.getTableItem('vip_privilege', curVip);

    player.friendsCount += curVipInfo.friend_count - oldVipInfo.friend_count;
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
    player.save();
};

var executeVipPrivilege = function(player) {
    if (!player.isVip()) return;

    var pri = table.getTableItem('vip_privilege', player.vip);
    var dg = utility.deepCopy(player.dailyGift);
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
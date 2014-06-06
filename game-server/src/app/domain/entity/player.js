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
var configData = require('../../../config/data');
var table = require('../../manager/table');
var _ = require("underscore");
var logger = require('pomelo-logger').getLogger(__filename);
var Card = require('./card');
var util = require('util');
var achieve = require('../achievement');

var cardLvs = table.getTable('card_lv_limit');
var resData = table.getTableItem('resource_limit', 1);
var MAX_POWER_VALUE = resData.power_value;
var MIN_CARD_COUNT = resData.card_count_min;

var lvLimit = table.getTableItem('lv_limit', 1);
var MAX_SPIRITOR_LV = lvLimit.spirit_lv_limit;
var MAX_SPIRITPOOL_LV = lvLimit.spirit_pool_lv_limit;

var giveBlessTab = table.getTable('give_bless_config');
var receiveBlessTab = table.getTable('receive_bless_config');
var friendsCountTab = table.getTable('friends_config');
var dgTabRow = table.getTableItem('daily_gift', 1);
var DEFAULT_RECEIVE_COUNT = giveBlessTab.getItem(1).count;
var DEFAULT_GIVE_COUNT = receiveBlessTab.getItem(1).count;
var DEFAULT_FRIENDS_COUNT = friendsCountTab.getItem(1).count;

var DAILY_LOTTERY_COUNT = dgTabRow.lottery_count;
var LOTTERY_FREE_COUNT = dgTabRow.lottery_free_count;
var POWER_BUY_COUNT = dgTabRow.power_buy_count;
var CHALLENGE_COUNT = dgTabRow.challenge_count;
var CHALLENGE_BUY_COUNT = dgTabRow.challenge_buy_count;
var EXP_CARD_COUNT = dgTabRow.exp_card_count;

var KNEELCOUNT_DEFAULT = 3

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
    //     if (player.lv <= 0 || player.lv >= configData.player.MAX_PLAYER_LV) {
    //         return;
    //     }

    //     var upgradeInfo = table.getTableItem('player_upgrade', player.lv);
    //     if (exp >= upgradeInfo.exp) {
    //         player.increase('lv');
    //         // 清空每级仙丹使用详细信息
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

        if (!player.cardBookMark.hasMark(card.tableId) && card.tableId != configData.card.EXP_CARD_ID) {
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
        // 达成vip成就
        achieve.vipTo(player, player.vip);
        
        recountVipPrivilege(player, oldVip);
    });
};

var correctPower = function(player) {
    var interval, power, now, times = 1,
        resumePoint;

    interval = configData.player.POWER_RESUME.interval;
    power = player.power;
    now = Date.now();

    if ((power.time + interval) <= now) {
        times = parseInt((now - power.time) / interval);
        resumePoint = configData.player.POWER_RESUME.point;
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
        'levelReward',
        'teachingStep',
        'exchangeCards',
        'activities',
        'initRate',
        'speaker',
        'honor',
        'superHonor',
        'cd',
        'plan',
        'useCardCount'
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
        lineUp: [{6:-1}],
        ability: 0,
        task: {
            id: 1,
            progress: 0,
            hasWin: false,
            mark: [],
            hasFragment: -1,
            boss: {
                count: 0,
                found: false
            },
            turn: {
                collected: 0,
                num: 1,
            }
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
            lotteryCount: DAILY_LOTTERY_COUNT, // 每日抽奖次数
            lotteryFreeCount: LOTTERY_FREE_COUNT, // 每日免费抽奖次数
            lotteryCountUsed: 0,
            powerGiven: [], // 体力赠送情况
            powerBuyCount: POWER_BUY_COUNT, // 购买体力次数
            challengeCount: CHALLENGE_COUNT, // 每日有奖竞技次数
            challengeBuyCount: CHALLENGE_BUY_COUNT, //每日有奖竞技购买次数
            expCardCount: EXP_CARD_COUNT,
            receivedBless: { // 接收的祝福
                count: DEFAULT_RECEIVE_COUNT,
                givers: []
            },
            gaveBless: { // 送出的祝福
                count: DEFAULT_GIVE_COUNT,
                receivers: []
            },
            hasGotLoginReward: 0,
            kneelCountLeft: KNEELCOUNT_DEFAULT,
            kneelList: [],
            rmTimerCount: 1,
            goldLuckyCard10: { // 每日高级魔石10连抽次数
                count: 0,
                got: false
            },
            goldLuckyCardForFragment: { // 每日单次高级魔石抽卡次数，判断是否获得卡魂
                count: 0,
                got: false
            },
            vipReward: 0
        },
        fragments: 0,
        energy: 0,
        elixir: 0,
        skillPoint: 0,
        spiritor: {
            lv: 1,
            spirit: configData.spirit.DEFAULT_SPIRIT
        },
        spiritPool: {
            lv: 1,
            exp: 0,
            collectCount: configData.spirit.MAX_COLLECT_COUNT
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
        rowFragmentCount: 0,  // 低级卡魂次数
        highFragmentCount: 0, // 高级卡魂次数
        highDrawCardCount: 0, // 高级抽卡次数
        cardsCount: MIN_CARD_COUNT,
        resetDate: '1970-1-1',
        firstTime: {
            star5card: 1,
            lowLuckyCard: 1,
            highLuckyCard: 1,
            highTenLuckCard: 1,
            frb: 1, // 首次充值礼包是否领取标记
            recharge: 0
        },
        levelReward: [],
        teachingStep: 0,
        exchangeCards: [],
        goldCards: {},
        activities: {},
        initRate: {
            star1: 0,
            star2: 0,
            star3: 0,
            star4: 0
        },
        speaker: 0,
        honor: 0,
        superHonor: 0,
        cd: {
            lastAtkTime: 0 // 上一次攻击boss的时间点
        },
        plan: {
            buy: false,
            flag: 0
        },
        useCardCount: {
            star4: 10,
            star5: 1,
            star6: 3
        }
    };

    Player.prototype.updateUseCardCoun = function(star, val) {
        var ucc = utility.deepCopy(this.useCardCount);
        ucc['star'+star] = val;
        this.useCardCount = ucc;
    };

    Player.prototype.canGetTurnReward = function() {
        return this.task.turn.collected == 15;
    };

    Player.prototype.nextTurn = function() {
        var task = utility.deepCopy(this.task);
        task.turn.collected = 0;
        task.turn.num += 1;

        if (task.turn.num > 5) {
            task.turn.num = 1;
        }

        this.task = task;
    };

    Player.prototype.buyPlan = function() {
        var plan = { buy: true, flag: 0 };
        this.plan = plan;
    };

    Player.prototype.hasBuyPlan = function() {
        return !!this.plan.buy;
    };

    Player.prototype.hasPlanFlag = function(id) {
        var flag = this.plan.flag || 0;
        return utility.hasMark(flag, id);
    };

    Player.prototype.setPlanFlag = function(id) {
        var plan = utility.deepCopy(this.plan);
        if (_.isUndefined(plan.flag)) {
            plan.flag = 0;
        }

        plan.flag = utility.mark(plan.flag, id);
        this.plan = plan;
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
            lotteryCount: DAILY_LOTTERY_COUNT, // 每日抽奖次数
            lotteryFreeCount: LOTTERY_FREE_COUNT + vipPrivilege.lottery_free_count, // 每日免费抽奖次数
            lotteryCountUsed: 0,
            powerGiven: [], // 体力赠送情况
            powerBuyCount: POWER_BUY_COUNT + vipPrivilege.buy_power_count, // 购买体力次数
            challengeCount: CHALLENGE_COUNT, // 每日有奖竞技次数
            challengeBuyCount: CHALLENGE_BUY_COUNT + vipPrivilege.challenge_buy_count, // 每日有奖竞技购买次数
            expCardCount: EXP_CARD_COUNT + vipPrivilege.exp_card_count,
            receivedBless: { // 接收的祝福
                count: realCount(this.lv, receiveBlessTab) + vipPrivilege.receive_bless_count,
                givers: []
            },
            gaveBless: { // 送出的祝福
                count: realCount(this.lv, giveBlessTab) + vipPrivilege.give_bless_count,
                receivers: []
            },
            hasGotLoginReward: 0,
            kneelCountLeft: KNEELCOUNT_DEFAULT,
            kneelList: [],
            rmTimerCount: 1,
            goldLuckyCard10: {
                count: 0,
                got: false
            },
            goldLuckyCardForFragment: {
                count: 0,
                got: false
            },
            vipReward: 0 // vip登陆奖励是否已领取标记 1：已领取 0：未领取
        };

        var pass = utility.deepCopy(this.pass);
        pass.resetTimes = 1;
        pass.mark = [];

        var task = utility.deepCopy(this.task);
        task.mark = [];

        var spiritPool = utility.deepCopy(this.spiritPool);
        spiritPool.collectCount = configData.spirit.MAX_COLLECT_COUNT + vipPrivilege.spirit_collect_count;

        this.dailyGift = dg;
        this.pass = pass;
        this.task = task;
        this.spiritPool = spiritPool;
        this.friendsCount = realCount(this.lv, friendsCountTab) + vipPrivilege.friend_count;
        this.resetDate = utility.shortDateString();

        // 记录登陆次数
        this.incLoginCount();

        // 重新计算5星卡成就
        this.recountStar5CardAchievement();
    };

    Player.prototype.dailyData = function() {
        return {
            dailyGift: this.dailyGift,
            pass: this.getPass(),
            task: this.task,
            spiritPool: this.spiritPool,
            friendsCount: this.friendsCount,
            goldCards: this.getGoldCard(),
            vipLoginReward: this.isVip() ? !this.dailyGift.vipReward : false,
            loginInfo: this.activities.logined || {count: 0, got: 0},
            rmTimerCount: this.dailyGift.rmTimerCount || 1
        };
    };

    Player.prototype.incGoldLuckyCard10 = function(){
        var goldLuckyCard10 = this.dailyGift.goldLuckyCard10;
        if (_.isUndefined(goldLuckyCard10)) {
            goldLuckyCard10 = {
                count: 0,
                got: false
            };
        }

        goldLuckyCard10.count += 1;
        this.updateGift('goldLuckyCard10', goldLuckyCard10);
    };

    Player.prototype.incGoldLuckyCardForFragment = function(){
        var goldLuckyCardForFragment = this.dailyGift.goldLuckyCardForFragment;
        if (_.isUndefined(goldLuckyCardForFragment)) {
            goldLuckyCardForFragment = {
                count: 0,
                got: false
            };
        }

        goldLuckyCardForFragment.count += 1;
        this.updateGift('goldLuckyCardForFragment', goldLuckyCardForFragment);
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
        this.activeCards().forEach(function(card) {
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
        });
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

    Player.prototype.canUpgradeSpiritor = function() {
        var spiritorData = table.getTableItem('spirit', this.spiritor.lv);
        if ( !! spiritorData && this.spiritor.spirit >= spiritorData.spirit_need) {
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

            if (spiritor.lv == MAX_SPIRITOR_LV) {
                total_spirit = 0;
            }
        }
        spiritor.spirit = total_spirit;
        this.set('spiritor', spiritor);
        this.activeSpiritorEffect();
    };

    Player.prototype.incSpiritPoolExp = function(exp) {
        var sp = _.clone(this.spiritPool);
        var total_exp = sp.exp + exp;
        var spData = table.getTableItem('spirit_pool', sp.lv);

        while ( !! spData && total_exp >= spData.exp_need && sp.lv < MAX_SPIRITPOOL_LV) {
            sp.lv += 1;
            total_exp -= spData.exp_need;
            spData = table.getTableItem('spirit_pool', sp.lv);

            if (sp.lv == MAX_SPIRITPOOL_LV) {
                total_exp = 0;
            }
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
        var ae = configData.card.ABILIGY_EXCHANGE;
        var spiritorData = table.getTableItem('spirit', this.spiritor.lv);
        var hp_pct = spiritorData.hp_inc;
        var atk_pct = spiritorData.atk_inc;

        this.activeCards().forEach(function(card) {
            var _a = card.ability();

            // 计算元神增加的战斗力
            var _hp = parseInt(card.init_hp / ae.hp * hp_pct / 100);
            var _atk = parseInt(card.init_atk / ae.atk * atk_pct / 100);

            if (!_.isNaN(_a)) {
                ability += _a + _hp + _atk;
            }
        });

        this.set('ability', ability);
        return ability;
    };

    Player.prototype.updateAbility = function() {
        this.set('ability', this.getAbility());
    };

    // Player.prototype.activeGroupEffect = function() {
    //     var cardIds = _.values(lineUpToObj(this.lineUp));
    //     var cards = _.values(this.cards).filter(function(id, c) {
    //         return c.star >= 3 && cardIds.indexOf(c.id) > -1;
    //     });
    //     var cardTable = table.getTable('cards');

    //     for (var i = 0; i < cards.length; i++) {
    //         var card = cards[i];
    //         var cdata = cardTable.getItem(card.id);
    //         var series = cdata.group.toString().split(',');
    //         var seriesCards = cardTable.filter(function(id, item) {
    //             return (series.indexOf(item.number) > -1) && (cardIds.indexOf(id) > -1);
    //         });

    //         if (!_.isEmpty(seriesCards) && (series.length === seriesCards.length)) {
    //             card.activeGroupEffect();
    //         }
    //     }
    // };

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
        return _.contains(this.activeCardIds(), card.id);
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

    Player.prototype.activeCardIds = function(){
        return this.lineUp.reduce(function(pre, cur){
            return pre.concat(_.values(cur));
        }, []);
    };

    Player.prototype.activeCards = function() {
        var cardIds = this.activeCardIds();
        return _.values(this.cards).filter(function(c) {
            return cardIds.indexOf(c.id) > -1;
        });
    };

    Player.prototype.updatePower = function(power) {
        this.set('power', power);
    };

    Player.prototype.consumePower = function(value) {
        if (typeof value == 'undefined' || this.power.value <= 0) return;

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

    Player.prototype.checkResumePower = function() {
        var interval, now, power, resumePoint, times;
        interval = configData.player.POWER_RESUME.interval;
        power = this.power;
        now = Date.now();
        times = 1;

        if ((power.time + interval) <= now) {
            times = parseInt((now - power.time) / interval);
            resumePoint = configData.player.POWER_RESUME.point;
            this.resumePower(resumePoint * times, power.time + interval * times);
            this.save();
        }
    };

    Player.prototype.resumePower = function(value, time) {
        var max_power = getMaxPower(this.lv);

        if (typeof value == 'undefined' || this.power.value >= max_power) return;

        var power = utility.deepCopy(this.power);
        power.value = _.min([max_power, power.value + value]);
        power.time = time || Date.now();
        this.updatePower(power);
    };

    //直接添加体力，不受上限限制
    Player.prototype.addPower = function(value) {
        if (!_.isNumber(value)) {
            logger.error('can not add power with value: ', value);
            return;
        }
        var power = _.clone(this.power);
        power.value += value;
        power.time = Date.now();
        this.updatePower(power);
    };

    Player.prototype.givePower = function(hour, value) {
        if (!_.isNumber(hour) || !_.isNumber(value)) {
            logger.error('can not give power with ', hour, value);
            return;
        }
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

    Player.prototype.updateLineUp = function(lineupObj, index) {
        if (_.isNull(index) || _.isUndefined(index)) {
            return this.set('lineUp', lineupObj);
        }

        var lu = _.clone(this.lineUp);
        if (index > lu.length) {
            throw new Error('can not update player lineUp with the index ' + index);
        }

        lu[index] = lineupObj;
        this.set('lineUp', lu);
        //checkLineUp(this);
    };

    Player.prototype.lineUpObj = function() {
        //checkLineUp(this);
        return this.lineUp;
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

        // 第一张满级5星卡
        if (targetCard.star == 5 && targetCard.lv == cardLvs.getItem(5).max_lv) {
            achieve.star5cardFullLevel(this);
        }
        // 第一张满级6星卡
        if (targetCard.star == 6 && targetCard.lv == cardLvs.getItem(6).max_lv) {
            achieve.star6cardFullLevel(this);
        }
        // 第一张满级7星卡
        if (targetCard.star == 7 && targetCard.lv == cardLvs.getItem(7).max_lv) {
            achieve.star7cardFullLevel(this);
        }

        return cb(null, {
            exp_obtain: expObtain,
            cur_lv: targetCard.lv,
            cur_exp: targetCard.exp,
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
        this.passMark.setValue(this.pass.mark).mark(layer);
        pass.mark = this.passMark.value;
        this.pass = pass;
    };

    Player.prototype.hasPassMark = function(layer) {
        if (layer < 1 || layer > 100) {
            logger.warn('无效的关卡层数 ', layer);
            return;
        }
        return this.passMark.setValue(this.pass.mark).hasMark(layer);
    };

    Player.prototype.canResetPassMark = function() {
        this.passMark.setValue(this.pass.mark);
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

        if (this.pass.mystical.diff < 5) {
            pass.mystical.diff += 1;
            pass.mystical.isTrigger = false;
        }
        
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
        if(utility.hasMark(si[key].mark, new Date().getDate())) {
            return false;
        }


        si[key].mark = utility.mark(si[key].mark, new Date().getDate());
        this.signIn = si;
        return true;
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

    Player.prototype.getRanking = function() {
        var rank = {
            ranking: 0
        };
        if (this.rank) {
            rank.ranking = this.rank.ranking;
        }
        return rank;
    };

    Player.prototype.getRank = function() {
        var rank = {
            ranking: 0,
            canGetReward: [],
            notCanGetReward: [],
            stats: {}
        };
        if (this.rank) {
            rank.ranking = this.rank.ranking;
            rank.canGetReward = this.rank.rankingRewards();
            rank.notCanGetReward = this.rank.rewardsNotHave();
            rank.stats = this.rank.stats();
        }
        return rank;
    };

    Player.prototype.getTask = function() {
        return {
            id: this.task.id,
            progress: this.task.progress,
            mark: this.task.mark,
            collected: this.task.turn != null ? this.task.turn.collected : 0
        };
    };

    Player.prototype.getSpiritor = function() {

        var spiritor = {
            lv: this.spiritor.lv,
            spirit: this.spiritor.spirit
        };

        return spiritor;
    };

    Player.prototype.addFriend = function(friend) {
        this.friends.push(friend);
    };

    Player.prototype.delFriend = function(fid) {
        var i, fri;
        for (i = 0; i < this.friends.length; i++) {
            fri = this.friends[i];
            if (fri.id == fid) {
                this.friends.splice(i, 1);
                break;
            }
        }
    };

    Player.prototype.hasFirstTime = function() {
        var ft = this.firstTime;
        for (var key in ft) {
            if (ft[key]) {
                return true;
            }
        }

        if (typeof this.firstTime.highTenLuckCard == 'undefined') {
            return true;
        }

        if (typeof this.firstTime.recharge == 'undefined' || this.firstTime.recharge < 128) {
            return true;
        }
        return false;
    };

    Player.prototype.getFirstTime = function() {
        var frb = typeof this.firstTime.frb == 'undefined' ? 1 : this.firstTime.frb;
        // frb = 1 为可领取状态
        if (this.cash <= 0) {
            frb = 0; // 不可领取状态
        }

        if (this.cash > 0 && frb == 0) {
            frb = 2; // 已领取状态
        }

        return {
            lowLuckyCard: this.firstTime.lowLuckyCard,
            highLuckyCard: this.firstTime.highLuckyCard,
            highTenLuckCard: typeof this.firstTime.highTenLuckCard == 'undefined' ? 1 : this.firstTime.highTenLuckCard,
            recharge: this.firstTime.recharge || 0,
            firstRechargeBox: frb
        };
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

        var lr = _.clone(this.levelRewardMark.value);
        this.set('levelReward', lr);
    };

    Player.prototype.lightUpCards = function() {
        var f = this.cardBookFlag.markPositions();
        var m = this.cardBookMark.markPositions();
        return _.union(f, m);
    };

    Player.prototype.addGoldCard = function(gc) {
        this.goldCards[gc.type] = gc;
    };

    Player.prototype.removeGoldCard = function(gc) {
        delete this.goldCards[gc.type];
    };

    Player.prototype.addGoldCards = function(gcs) {
        for (var i = 0; i < gcs.length; i++) {
            this.addGoldCard(gcs[i]);
        }
    };

    Player.prototype.getGoldCard = function() {
        var gc = {};
        for (var g in this.goldCards) {
            gc[g] = this.goldCards[g].toJson();
        }
        return gc;
    };

    Player.prototype.setInitRate = function(star, val) {
        if (star < 1 || star > 6) {
            return;
        }

        var ir = utility.deepCopy(this.initRate);
        ir['star' + star] = val;
        this.initRate = ir;
    };

    Player.prototype.incInitRate = function(star, val) {
        if (star < 1 || star > 6) {
            return;
        }

        var ir = utility.deepCopy(this.initRate);
        if (typeof ir['star' + star] == 'undefined') {
            ir['star' + star] = 0;
        }
        ir['star' + star] += val;
        this.initRate = ir;
    };

    Player.prototype.isRechargeFirstTime = function(productId) {
        if (typeof productId != 'number' || productId > 7) {
            return false;
        }
        return !utility.hasMark(this.firstTime.recharge || 0, productId);
    };

    Player.prototype.setRechargeFirstTime = function(productId) {
        if (typeof productId == 'number') {
            var ft = utility.deepCopy(this.firstTime);
            ft.recharge = utility.mark(ft.recharge || 0, productId);
            this.firstTime = ft;
        }
    };

    Player.prototype.getCD = function() {
        var lastAtkTime = this.cd.lastAtkTime || 0;
        var now = new Date().getTime();
        var duration = lastAtkTime + 30 * 60 * 1000 - now;
        return duration < 0 ? 0 : duration;
    };

    Player.prototype.resetCD = function() {
        var cd = utility.deepCopy(this.cd);
        cd.lastAtkTime = new Date().getTime();
        this.cd = cd;
    };

    Player.prototype.removeCD = function() {
        var cd = utility.deepCopy(this.cd);
        cd.lastAtkTime = 0;
        this.cd = cd;
    };

    Player.prototype.incBossCount = function() {
        var task = utility.deepCopy(this.task);
        if (!task.boss) {
            task.boss = {
                count: 0,
                found: false
            }
        }

        task.boss.count += 1;
        this.task = task;
    };

    Player.prototype.setBossFound = function(val) {
        var task = utility.deepCopy(this.task);
        if (!task.boss) {
            task.boss = {
                count: 0,
                found: false
            }
        }

        task.boss.found = val;
        if (!val) {
            task.boss.count = 0;
        }

        this.task = task;
    };

    Player.prototype.removeTimerConsume = function() {
        if (typeof this.dailyGift.rmTimerCount == 'undefined') {
            this.updateGift('rmTimerCount', 1);
        }

        var consume = 0;
        if (this.dailyGift.rmTimerCount <= 10) {
            consume = 20;
        } else if (this.dailyGift.rmTimerCount <= 20 && this.dailyGift.rmTimerCount > 10) {
            consume = 50;
        } else {
            consume = 100;
        }

        return consume;
    };

    Player.prototype.incRmTimerCount = function() {
        if (typeof this.dailyGift.rmTimerCount == 'undefined') {
            this.updateGift('rmTimerCount', 1);
        }

        var count = parseInt(this.dailyGift.rmTimerCount + 1);
        this.updateGift('rmTimerCount', count);
    };

    Player.prototype.kneelCountLeft = function() {
        if (typeof this.dailyGift.kneelCountLeft == 'undefined') {
            this.updateGift('kneelCountLeft', KNEELCOUNT_DEFAULT);
        }
        return this.dailyGift.kneelCountLeft;
    };

    Player.prototype.hasKneel = function(pid) {
        if (typeof this.dailyGift.kneelList == 'undefined') {
            this.updateGift('kneelList', []);
            return false;
        }
        return this.dailyGift.kneelList.indexOf(pid) > -1;
    };

    Player.prototype.addKneel = function(pid) {
        if (typeof this.dailyGift.kneelList == 'undefined') {
            this.updateGift('kneelList', [pid]);
        } else {
            var dg = utility.deepCopy(this.dailyGift);
            dg.kneelList.push(pid);
            this.dailyGift = dg;
        }
    };

    Player.prototype.getDailyGift = function() {
        var dailyGift = utility.deepCopy(this.dailyGift);

        delete dailyGift.kneelCountLeft;
        delete dailyGift.kneelList;
        delete dailyGift.rmTimerCount;
        return dailyGift;
    };

    Player.prototype.hasLoginCountReward = function(count) {
        loginedCount = this.activities.logined != null ? this.activities.logined.got : 0;
        return utility.hasMark(loginedCount, count);
    };

    Player.prototype.canGetLoginCountReward = function(count) {
        loginedCount = this.activities.logined != null ? this.activities.logined.count : 1;
        return loginedCount >= count;
    };

    Player.prototype.setLoginCountReward = function(count) {
        var act = utility.deepCopy(this.activities);

        if (typeof act.logined == 'undefined') {
            act.logined = {
                count: 1, 
                got: 0
            };
        }

        act.logined.got = utility.mark(act.logined.got, count);
        this.set('activities', act);
    };

    Player.prototype.incLoginCount = function() {
        var act = utility.deepCopy(this.activities);
        if (typeof act.logined == 'undefined') {
            act.logined = {
                count: 0, 
                got: 0
            };
        }
        act.logined.count += 1;
        this.set('activities', act);
    };

    Player.prototype.recountStar5CardAchievement = function() {
        if (this.firstTime.star5card) return;

        var cards = _.values(this.cards);
        var star5Num = cards.filter(function(c) {
            return c.star >= 5;
        }).length;
        var star6Num = cards.filter(function(c) {
            return c.star >= 6;
        }).length;
        var star7Num = cards.filter(function(c) {
            return c.star == 7;
        }).length;

        if (star5Num > 0) achieve.star5card(this, star5Num);
        if (star6Num > 0) achieve.star6card(this, star6Num);
        if (star7Num > 0) achieve.star7card(this, star7Num);
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
            //ability: this.getAbility(),
            task: this.getTask(),
            pass: this.getPass(),
            dailyGift: this.getDailyGift(),
            skillPoint: this.skillPoint,
            energy: this.energy,
            fragments: this.fragments,
            elixir: this.elixir,
            spiritor: this.getSpiritor(),
            spiritPool: utility.deepCopy(this.spiritPool),
            cards: _.values(this.cards)
                .sort(function(x, y) {
                    return y.createTime - x.createTime;
                })
                .map(function(card) {
                    return card.toJson();
                }),
            rank: this.getRanking(),
            signIn: utility.deepCopy(this.signIn),
            firstTime: this.getFirstTime(),
            teachingStep: this.teachingStep,
            cardsCount: this.cardsCount,
            exchangeCards: this.exchangeCards,
            goldCards: this.getGoldCard(),
            speaker: this.speaker,
            honor: this.honor,
            superHonor: this.superHonor,
            bossInfo: {
                cd: this.getCD(),
                kneelCountLeft: this.kneelCountLeft(),
                kneelList: this.dailyGift.kneelList || [],
                rmTimerCount: this.dailyGift.rmTimerCount || 1,
                canReceive: this.hasFriendReward || false,
            }
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
        return 2000 * 50 + 8000 * (lv - 50);
    }
};

// var processSpiritPoll = function(sp) {
//     if (_.isEmpty(sp)) {
//         return sp;
//     }
//     sp = utility.deepCopy(sp);
//     sp.collectCount = configData.spirit.MAX_COLLECT_COUNT - sp.collectCount;
//     return sp;
// };

// var processDailyGift = function(dg) {
//     if (_.isEmpty(dg)) {
//         return dg;
//     }
//     dg = utility.deepCopy(dg);
//     dg.gaveBless.count = configData.message.MAX_GIVE_COUNT - dg.gaveBless.count;
//     dg.receivedBless.count = configData.message.MAX_RECEIVE_COUNT - dg.receivedBless.count;
//     dg.lotteryCount = DAILY_LOTTERY_COUNT - dg.lotteryCount;
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
    // var powerLimit = configData.player.POWER_LIMIT;
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
    dg.challengeBuyCount += curVipInfo.challenge_buy_count - oldVipInfo.challenge_buy_count;
    dg.expCardCount += curVipInfo.exp_card_count - oldVipInfo.exp_card_count;
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
    dg.challengeBuyCount += pri.challenge_buy_count;

    player.dailyGift = dg;

    var sp = _.clone(player.spiritPool);
    sp.collectCount += pri.spirit_collect_count;

    player.spiritPool = sp;
    player.save();
};

module.exports = Player;